import { render, screen, fireEvent, waitFor } from "../helpers";
import WaitingView from "@views/waiting-view.tsx";
import { useNavigate } from "react-router-dom";
import ApiService from "@services/api-service.ts";
import { PARTY_UUID_KEY } from "@constants/storage-keys.ts";
import { IPositionInWaitlist } from "@models/index.ts";
import { joinWaitlistRouteName, checkedInRouteName } from "@views/index.tsx";

// Mock the AppBar to reduce render time
jest.mock("@components/app-bar", () => ({
    __esModule: true,
    default: () => <div>AppBar</div>,
}));

// Mock the ErrorModal and CancelModal to reduce render time
jest.mock("@components/error-modal", () => ({
    __esModule: true,
    default: ({ isOpen }: { isOpen: boolean }) => (
        <div data-open={isOpen}>ErrorModal</div>
    ),
}));
jest.mock("@components/cancel-modal", () => ({
    __esModule: true,
    default: ({
        isOpen,
        onCancelConfirmed,
    }: {
        isOpen: boolean;
        onCancelConfirmed: () => void;
    }) => (
        <div data-open={isOpen}>
            CancelModal{" "}
            <button onClick={onCancelConfirmed}>
                waiting_cancellation_confirm
            </button>
        </div>
    ),
}));

// Mock ApiService
const service = {
    checkPositionInWaitlist: jest.fn(),
    checkIn: jest.fn(),
    cancelPositionInWaitlist: jest.fn(),
};
jest.mock("@services/api-service.ts", () => {
    return {
        __esModule: true,
        default: {
            get instance() {
                return service;
            },
        },
    };
});

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
    value: {
        getItem: (...args: string[]) => localStorageMock.getItem(...args),
        clear: () => localStorageMock.clear(),
    },
});

// Other mocks
jest.mock("react-router-dom");

describe("WaitingView", () => {
    // Router navigate mock
    const navigateMock = jest.fn();
    jest.mocked(useNavigate).mockReturnValue(navigateMock);

    const partyUuid = "test-uuid";
    let checkPositionCallback: (position: IPositionInWaitlist) => void;
    const position: IPositionInWaitlist = {
        position: 1,
        checkInAllowed: false,
    };

    function renderAndTriggerPositionUpdate() {
        render(<WaitingView />);

        // Simulate the position received
        checkPositionCallback = (
            ApiService.instance.checkPositionInWaitlist as jest.Mock
        ).mock.calls[0][1];
        checkPositionCallback(position);
    }

    beforeEach(() => {
        localStorageMock.getItem.mockReturnValue(partyUuid);
        position.position = 5;
        position.checkInAllowed = false;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render the AppBar, default title and body message, cancel button and no checkin button ", () => {
        render(<WaitingView />);

        // Check the party_uuid has been retrieved
        expect(localStorageMock.getItem).toHaveBeenCalledWith(PARTY_UUID_KEY);

        // Validate UI
        expect(screen.getByText("AppBar")).toBeDefined();
        expect(screen.getByText("waiting_body")).toBeDefined();

        expect(screen.queryByText("waiting_checkin")).toBeNull();
    });

    describe("Cancel flow", () => {
        it("should open the CancelModal on cancel button click", async () => {
            render(<WaitingView />);

            fireEvent.click(screen.getByText("waiting_cancellation"));

            await waitFor(() =>
                expect(screen.getByText("CancelModal")).toHaveAttribute(
                    "data-open",
                    "true"
                )
            );

            expect(service.cancelPositionInWaitlist).not.toHaveBeenCalled();
            expect(navigateMock).not.toHaveBeenCalled();
            expect(localStorageMock.clear).not.toHaveBeenCalled();
        });

        it("should call ApiService.cancelPositionInWaitlist, clear storage, then redirect on confirmation", async () => {
            service.cancelPositionInWaitlist.mockResolvedValue(true);
            render(<WaitingView />);

            fireEvent.click(screen.getByText("waiting_cancellation"));
            await waitFor(() =>
                expect(screen.getByText("CancelModal")).toHaveAttribute(
                    "data-open",
                    "true"
                )
            );
            fireEvent.click(screen.getByText("waiting_cancellation_confirm"));

            await waitFor(() =>
                expect(service.cancelPositionInWaitlist).toHaveBeenCalledWith(
                    partyUuid
                )
            );
            expect(navigateMock).toHaveBeenCalledWith(joinWaitlistRouteName);
            expect(localStorageMock.clear).toHaveBeenCalled();
        });
    });

    describe("Check in flow", () => {
        beforeEach(() => {
            position.checkInAllowed = true;
            position.position = 0;
        });

        async function renderAndWaitForCheckInButton() {
            renderAndTriggerPositionUpdate();

            // Check in button appears
            await waitFor(() =>
                expect(screen.getByText("waiting_checkin")).toBeDefined()
            );
        }

        it("should display the checking button when the Api allow it", async () => {
            await renderAndWaitForCheckInButton();

            // Validate the texts changed
            expect(screen.getByText("waiting_checkin_title")).toBeDefined();
            expect(screen.getByText("waiting_checkin_body")).toBeDefined();
        });

        it("should call the ApiService.checkIn, clear the localeStorage, then redirect", async () => {
            service.checkIn.mockResolvedValue(true);

            await renderAndWaitForCheckInButton();

            fireEvent.click(screen.getByText("waiting_checkin"));

            await waitFor(() =>
                expect(service.checkIn).toHaveBeenCalledWith(partyUuid)
            );
            expect(localStorageMock.clear).toHaveBeenCalled();
            expect(navigateMock).toHaveBeenCalledWith(checkedInRouteName);
        });

        it("should display the ErrorModal when the ApiService.checkIn fails", async () => {
            service.checkIn.mockRejectedValue(false);

            await renderAndWaitForCheckInButton();

            fireEvent.click(screen.getByText("waiting_checkin"));

            await waitFor(() =>
                expect(service.checkIn).toHaveBeenCalledWith(partyUuid)
            );
            await waitFor(() =>
                expect(screen.getByText("ErrorModal")).toHaveAttribute(
                    "data-open",
                    "true"
                )
            );
            expect(localStorageMock.clear).not.toHaveBeenCalled();
            expect(navigateMock).not.toHaveBeenCalled();
        });
    });

    it("should update the title based on the position received", async () => {
        renderAndTriggerPositionUpdate();

        // Somewhere in the queue
        await waitFor(() =>
            expect(screen.getByText("waiting_title")).toBeDefined()
        );

        // Next one
        position.position = 0;
        checkPositionCallback(position);

        await waitFor(() =>
            expect(screen.getByText("waiting_next")).toBeDefined()
        );

        // Check in allowed
        position.checkInAllowed = true;
        checkPositionCallback(position);

        await waitFor(() =>
            expect(screen.getByText("waiting_checkin_title")).toBeDefined()
        );
    });
});
