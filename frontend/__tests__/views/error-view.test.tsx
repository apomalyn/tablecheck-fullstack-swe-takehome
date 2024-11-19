import { render, screen, act } from "../helpers";
import { routeName } from "@views/join-waitlist-view";
import { waitFor } from "@testing-library/dom";
import { useNavigate } from "react-router-dom";
import { ErrorView } from "@views/index.tsx";

jest.mock("react-router-dom");

jest.mock("@components/app-bar", () => ({
    __esModule: true,
    default: () => <div>AppBar</div>,
}));

const useThemeMock = {
    isDarkMode: true,
};

jest.mock("@hooks/use-theme", () => {
    return {
        __esModule: true,
        useTheme: () => useThemeMock,
    };
});

describe("ErrorView", () => {
    const navigate = jest.fn();
    jest.mocked(useNavigate).mockReturnValue(navigate);

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should display the error messages and timer before redirection in dark mode", () => {
        render(<ErrorView />);

        expect(screen.getByText("error_title")).toBeInTheDocument();
        expect(screen.getByText("error")).toBeInTheDocument();
        expect(screen.getByText("error_redirect")).toBeInTheDocument();
        expect(screen.getByRole("main")).toHaveClass("dark");
    });

    it("should display the error messages and timer before redirection in light mode", () => {
        useThemeMock.isDarkMode = false;
        render(<ErrorView />);

        expect(screen.getByText("error_title")).toBeInTheDocument();
        expect(screen.getByText("error")).toBeInTheDocument();
        expect(screen.getByText("error_redirect")).toBeInTheDocument();
        expect(screen.getByRole("main")).toHaveClass("light");
    });

    it("should redirect to /join-waitlist after countdown", async () => {
        jest.useFakeTimers();
        render(<ErrorView />);

        act(() => {
            jest.advanceTimersByTime(21000); // 20 seconds
        });

        await waitFor(() => {
            expect(navigate).toHaveBeenCalledWith(routeName);
        });

        jest.useRealTimers();
    });
});
