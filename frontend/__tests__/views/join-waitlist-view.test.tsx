import { useNavigate } from "react-router-dom";
import { fireEvent, render, screen, waitFor, act } from "../helpers";
import JoinWaitlistView from "@views/join-waitlist-view.tsx";
import { useRestaurantConfig } from "@hooks/use-restaurant-config";
import { IRestaurantConfiguration, IParty } from "@models/index";
import { routeName } from "@views/waiting-view.tsx";
import { within } from "@testing-library/dom";
import {
    PARTY_EXPIRES_ON_KEY,
    PARTY_UUID_KEY,
} from "@constants/storage-keys.ts";

// Mock the AppBar to reduce render time
jest.mock("@components/app-bar", () => ({
    __esModule: true,
    default: () => <div>AppBar</div>,
}));

// Mock the ErrorModal to reduce render time
jest.mock("@components/error-modal", () => ({
    __esModule: true,
    default: ({ isOpen }: { isOpen: boolean,  }) => (
        <div data-open={isOpen}>ErrorModal</div>
    ),
}));

// ApiService.instance.joinWaitlist mock
const party = {
    uuid: "1234",
    name: "John Doe",
    size: 2,
    expiresOn: new Date(),
} as IParty;
const service = {
    joinWaitlist: jest.fn(),
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
    setItem: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
    value: {
        setItem: (...args: string[]) => localStorageMock.setItem(...args),
    },
});

// Other mocks
jest.mock("react-router-dom");
jest.mock("@hooks/use-restaurant-config");

describe("JoinWaitlistView", () => {
    // Router navigate mock
    const navigateMock = jest.fn();
    jest.mocked(useNavigate).mockReturnValue(navigateMock);

    // useRestaurantConfig mock
    const configMock = { maxPartySize: 10 } as IRestaurantConfiguration;
    jest.mocked(useRestaurantConfig).mockReturnValue({ config: configMock });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should display the appbar, the form with 2 inputs, and the join button", () => {
        render(<JoinWaitlistView />);

        expect(screen.getByText("join_waitlist_title")).toBeInTheDocument();

        // Validate the form with 2 inputs
        const form = screen.getByRole("form");
        expect(form).toBeDefined();
        expect(within(form).getByLabelText("join_waitlist_name")).toBeDefined();
        expect(
            within(form).getByLabelText("join_waitlist_party_size")
        ).toBeDefined();

        // Validate the button. It should be disabled
        const button = within(form).getByText("join_waitlist_submit", {
            selector: "button",
        });
        expect(button).toBeDefined();
        expect(button).toBeDisabled();
    });

    it("should display a input[type=text] with a min and max value for the party size", () => {
        render(<JoinWaitlistView />);

        const partySizeInput = screen.getByLabelText("join_waitlist_name", {
            selector: "input",
        });
        expect(partySizeInput).toBeDefined();
        expect(partySizeInput).toHaveAttribute("name", "name");
        expect(partySizeInput).toHaveAttribute("type", "text");
        expect(partySizeInput).toHaveAttribute("autocomplete", "name");
        expect(partySizeInput).toHaveAttribute("aria-required", "true");
        expect(partySizeInput).toHaveAttribute(
            "placeholder",
            "join_waitlist_name_placeholder"
        );
    });

    it("should display a input[type=number] with a min and max value for the party size", () => {
        render(<JoinWaitlistView />);

        const partySizeInput = screen.getByLabelText(
            "join_waitlist_party_size",
            { selector: "input" }
        );
        expect(partySizeInput).toBeDefined();
        expect(partySizeInput).toHaveAttribute("name", "party_size");
        expect(partySizeInput).toHaveAttribute("type", "number");
        expect(partySizeInput).toHaveAttribute("min", "1");
        expect(partySizeInput).toHaveAttribute(
            "max",
            configMock.maxPartySize.toString()
        );
        expect(partySizeInput).toHaveAttribute("aria-required", "true");
    });

    it("should register name change", () => {
        render(<JoinWaitlistView />);

        const nameInput = screen.getByPlaceholderText(
            "join_waitlist_name_placeholder"
        );
        fireEvent.change(nameInput, { target: { value: "John Doe" } });

        expect(nameInput).toHaveValue("John Doe");
        expect(nameInput).not.toHaveAttribute("aria-invalid");
    });

    describe("party_size input", () => {
        it("valid values", () => {
            render(<JoinWaitlistView />);

            const partySizeInput = screen.getByLabelText(
                "join_waitlist_party_size"
            );
            // Lower bound
            fireEvent.change(partySizeInput, { target: { value: 1 } });
            expect(partySizeInput).toHaveValue(1);
            expect(partySizeInput).not.toHaveAttribute("aria-invalid");

            // Highest value
            fireEvent.change(partySizeInput, {
                target: { value: configMock.maxPartySize },
            });
            expect(partySizeInput).toHaveValue(configMock.maxPartySize);
            expect(partySizeInput).not.toHaveAttribute("aria-invalid");
        });

        it("invalid values", () => {
            render(<JoinWaitlistView />);

            const partySizeInput = screen.getByLabelText(
                "join_waitlist_party_size"
            );
            // Try 0
            fireEvent.change(partySizeInput, { target: { value: 0 } });
            expect(partySizeInput).toHaveValue(0);
            expect(partySizeInput).toHaveAttribute("aria-invalid");

            // Try empty
            fireEvent.change(partySizeInput, { target: { value: "" } });
            expect(partySizeInput).toHaveValue(null);
            expect(partySizeInput).toHaveAttribute("aria-invalid");

            // Highest value
            fireEvent.change(partySizeInput, {
                target: { value: configMock.maxPartySize + 1 },
            });
            expect(partySizeInput).toHaveValue(configMock.maxPartySize + 1);
            expect(partySizeInput).toHaveAttribute("aria-invalid");
        });
    });

    describe("submit form", () => {
        it("should submit the form then redirect", async () => {
            service.joinWaitlist.mockResolvedValue(party);
            render(<JoinWaitlistView />);

            const nameInput = screen.getByPlaceholderText(
                "join_waitlist_name_placeholder"
            );
            const partySizeInput = screen.getByLabelText(
                "join_waitlist_party_size"
            );
            const submitButton = screen.getByText("join_waitlist_submit");

            fireEvent.change(partySizeInput, { target: { value: party.size } });
            expect(submitButton).toBeDisabled(); // Should stay disable until the name is entered
            fireEvent.change(nameInput, { target: { value: party.name } });
            expect(submitButton).not.toBeDisabled();
            act(() => {
                fireEvent.click(submitButton);
            });

            await waitFor(() =>
                expect(service.joinWaitlist).toHaveBeenCalledWith(
                    party.name,
                    party.size
                )
            );
            await waitFor(() =>
                expect(localStorageMock.setItem).toHaveBeenCalledTimes(2)
            );
            expect(localStorageMock.setItem).toHaveBeenNthCalledWith(
                1,
                PARTY_UUID_KEY,
                party.uuid
            );
            expect(localStorageMock.setItem).toHaveBeenNthCalledWith(
                2,
                PARTY_EXPIRES_ON_KEY,
                party.expiresOn.toUTCString()
            );
            expect(navigateMock).toHaveBeenCalledWith(routeName);
        });

        it("should display the error modal when the api call fails", async () => {
            service.joinWaitlist.mockRejectedValue(null);
            render(<JoinWaitlistView />);

            const nameInput = screen.getByPlaceholderText(
                "join_waitlist_name_placeholder"
            );
            const submitButton = screen.getByText("join_waitlist_submit");

            fireEvent.change(nameInput, { target: { value: party.name } });
            act(() => {
                fireEvent.click(submitButton);
            });

            await waitFor(() =>
                expect(service.joinWaitlist).toHaveBeenCalledWith(
                    party.name,
                    1 // Didn't change the default value.
                )
            );
            await waitFor(() => {
                expect(screen.getByText("ErrorModal")).toHaveAttribute("data-open", "true");
            });
            expect(localStorageMock.setItem).not.toHaveBeenCalled();
            expect(navigateMock).not.toHaveBeenCalled();
        });
    });
});
