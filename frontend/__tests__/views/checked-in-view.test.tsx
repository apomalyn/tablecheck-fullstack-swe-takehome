import { render, screen, act } from "../helpers";
import CheckedInView from "@views/checked-in-view.tsx";
import { routeName } from "@views/join-waitlist-view";
import { waitFor } from "@testing-library/dom";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom");

jest.mock("@components/app-bar", () => ({
    __esModule: true,
    default: () => <div>AppBar</div>,
}));

describe("CheckedInView", () => {
    const navigate = jest.fn();
    jest.mocked(useNavigate).mockReturnValue(navigate);

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should display the thank you, instruction, and the timer message.", () => {
        render(<CheckedInView />);

        expect(screen.getByText("checked_in_thank_you")).toBeInTheDocument();
        expect(screen.getByText("checked_in_instruction")).toBeInTheDocument();
        expect(screen.getByText("checked_in_redirect")).toBeInTheDocument();
    });

    it("should redirect to /join-waitlist after countdown", async () => {
        jest.useFakeTimers();
        render(<CheckedInView />);

        act(() => {
            jest.advanceTimersByTime(21000); // 20 seconds
        })

        await waitFor(() => {
            expect(navigate).toHaveBeenCalledWith(routeName);
        });

        jest.useRealTimers();
    });
});
