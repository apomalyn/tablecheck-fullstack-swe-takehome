import { fireEvent, render, screen } from "../helpers";
import ErrorModal from "@components/error-modal.tsx";
import { useTheme } from "@hooks/use-theme.tsx";

const useThemeMock = {
    isDarkMode: true,
    toggleDarkMode: jest
        .fn()
        .mockImplementation(
            () => (useThemeMock.isDarkMode = !useThemeMock.isDarkMode)
        ),
};
jest.mock("@hooks/use-theme");

describe("ErrorModal", () => {
    const onOpenChange = jest.fn();

    beforeEach(() => {
        jest.mocked(useTheme).mockReturnValue(useThemeMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render the modal when isOpen is true", () => {
        render(<ErrorModal isOpen={true} onOpenChange={onOpenChange} />);

        expect(screen.getByText("error_title")).toBeInTheDocument();
        expect(screen.getByText("error_try_again")).toBeInTheDocument();
        expect(screen.getByText("ok")).toBeInTheDocument();
    });

    it("should not render the modal when isOpen is false", () => {
        render(<ErrorModal isOpen={false} onOpenChange={onOpenChange} />);

        expect(screen.queryByText("error_try_again")).not.toBeInTheDocument();
    });

    it("should call onOpenChange when OK is clicked", () => {
        render(<ErrorModal isOpen={true} onOpenChange={onOpenChange} />);

        fireEvent.click(screen.getByText("ok"));
        expect(onOpenChange).toHaveBeenCalled();
    });

    it("should call onOpenChange when close icon is clicked", () => {
        render(<ErrorModal isOpen={true} onOpenChange={onOpenChange} />);

        // Click on the close icon.
        fireEvent.click(screen.getByLabelText("Close"));
        expect(onOpenChange).toHaveBeenCalled();
    });
});
