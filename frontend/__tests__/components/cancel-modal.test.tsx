import { fireEvent, render, screen } from "../helpers";
import CancelModal from "@components/cancel-modal.tsx";
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

describe("CancelModal", () => {
    const onCancelConfirmed = jest.fn();
    const onOpenChange = jest.fn();

    beforeEach(() => {
        jest.mocked(useTheme).mockReturnValue(useThemeMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render the modal when isOpen is true", () => {
        render(
            <CancelModal
                isOpen={true}
                onCancelConfirmed={onCancelConfirmed}
                onOpenChange={onOpenChange}
            />
        );

        expect(screen.getByText("cancellation_cancel")).toBeInTheDocument();
        expect(screen.getByText("cancellation_confirm")).toBeInTheDocument();
        expect(screen.getByText("cancellation_body")).toBeInTheDocument();
    });

    it("should not render the modal when isOpen is false", () => {
        render(
            <CancelModal
                isOpen={false}
                onCancelConfirmed={onCancelConfirmed}
                onOpenChange={onOpenChange}
            />
        );

        expect(screen.queryByText("cancellation_body")).not.toBeInTheDocument();
    });

    it("should call onOpenChange when cancel is clicked", () => {
        render(
            <CancelModal
                isOpen={true}
                onCancelConfirmed={onCancelConfirmed}
                onOpenChange={onOpenChange}
            />
        );

        fireEvent.click(screen.getByText("cancellation_cancel"));
        expect(onOpenChange).toHaveBeenCalled();
        expect(onCancelConfirmed).not.toHaveBeenCalled();
    });

    it("should call onOpenChange when close icon is clicked", () => {
        render(
            <CancelModal
                isOpen={true}
                onCancelConfirmed={onCancelConfirmed}
                onOpenChange={onOpenChange}
            />
        );

        // Click on the close icon.
        fireEvent.click(screen.getByLabelText("Close"));
        expect(onOpenChange).toHaveBeenCalled();
        expect(onCancelConfirmed).not.toHaveBeenCalled();
    });

    it("should call onCancelConfirmed when the confirm button is clicked", () => {
        render(
            <CancelModal
                isOpen={true}
                onCancelConfirmed={onCancelConfirmed}
                onOpenChange={onOpenChange}
            />
        );

        fireEvent.click(screen.getByText("cancellation_confirm"));
        expect(onCancelConfirmed).toHaveBeenCalled();
    });
});
