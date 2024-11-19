import { fireEvent, render, screen } from "../helpers";
import AppBar from "@components/app-bar";
import { useRestaurantConfig, useTheme } from "@hooks/index";
import IRestaurantConfiguration from "@models/restaurant-configuration.ts";

const useThemeMock = {
    isDarkMode: true,
    toggleDarkMode: jest
        .fn()
        .mockImplementation(
            () => (useThemeMock.isDarkMode = !useThemeMock.isDarkMode)
        ),
};
const useRestaurantConfigMock = {
    config: { name: "Test Restaurant" } as IRestaurantConfiguration,
};

jest.mock("@hooks/index");

describe("AppBar", () => {
    beforeEach(() => {
        useThemeMock.isDarkMode = true;

        jest.mocked(useTheme).mockReturnValue(useThemeMock);
        jest.mocked(useRestaurantConfig).mockReturnValue(
            useRestaurantConfigMock
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render the AppBar", () => {
        render(<AppBar />);

        expect(
            screen.getByText(useRestaurantConfigMock.config.name)
        ).toBeVisible();
        expect(screen.getByRole("button")).toBeVisible();
    });

    it("should toggle light mode on button click", async () => {
        render(<AppBar />);

        const button = screen.getByLabelText("toggle_light_mode", {
            selector: "button",
        });

        expect(button).toBeDefined();
        fireEvent.click(button);
        expect(useThemeMock.toggleDarkMode).toHaveBeenCalled();
    });

    it("should toggle dark mode on button click", () => {
        useThemeMock.isDarkMode = false;
        render(<AppBar />);

        const button = screen.getByLabelText("toggle_dark_mode", {
            selector: "button",
        });

        expect(button).toBeDefined();
        fireEvent.click(button);
        expect(useThemeMock.toggleDarkMode).toHaveBeenCalled();
    });
});
