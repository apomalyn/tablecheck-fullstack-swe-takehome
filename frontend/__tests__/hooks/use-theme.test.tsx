import { useTheme, ThemeContextProvider } from "@hooks/index.tsx";
import { render, screen, fireEvent } from "../helpers.tsx";

const TestComponent = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();
    return (
        <div>
            <span data-testid="mode">{isDarkMode ? "dark" : "light"}</span>
            <button onClick={toggleDarkMode}>Toggle</button>
        </div>
    );
};

describe("ThemeContextProvider", () => {
    test("provides the default value and toggles dark mode", () => {
        render(
            <ThemeContextProvider>
                <TestComponent />
            </ThemeContextProvider>
        );

        const modeElement = screen.getByTestId("mode");
        const toggleButton = screen.getByText("Toggle");

        // Check that the default mode
        expect(modeElement.textContent).toBe("dark");

        // Toggle the mode
        fireEvent.click(toggleButton);
        expect(modeElement.textContent).toBe("light");

        // Toggle back
        fireEvent.click(toggleButton);
        expect(modeElement.textContent).toBe("dark");
    });

    test("throws error when useTheme is used outside of ThemeContextProvider", () => {
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        expect(() => render(<TestComponent />)).toThrow(
            "Context must be used within a context provider"
        );

        consoleErrorSpy.mockRestore();
    });
});
