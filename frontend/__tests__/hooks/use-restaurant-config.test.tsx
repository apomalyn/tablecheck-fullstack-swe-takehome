import { render, waitFor, screen } from "../helpers";
import RestaurantConfigContextProvider, {
    useRestaurantConfig,
} from "@hooks/use-restaurant-config";
import IRestaurantConfiguration from "@models/restaurant-configuration";

// Mock the ApiService
jest.mock("@services/api-service.ts", () => {
    return {
        __esModule: true,
        default: {
            get instance() {
                return {
                    getRestaurantConfiguration: jest
                        .fn()
                        .mockResolvedValue(config),
                };
            },
        },
    };
});

const config: IRestaurantConfiguration = {
    name: "Test Restaurant",
    capacity: 100,
    maxPartySize: 10,
};

const TestComponent = () => {
    const { config } = useRestaurantConfig();
    return <div>{config ? config.name : "Loading..."}</div>;
};

describe("RestaurantConfigContextProvider", () => {
    it("should provides the restaurant configuration after calling ApiService", async () => {
        render(
            <RestaurantConfigContextProvider>
                <TestComponent />
            </RestaurantConfigContextProvider>
        );

        // Checking for loading state
        expect(screen.getByText("Loading...")).toBeInTheDocument();

        // Wait for the API call and checking the rendered config name
        await waitFor(() => {
            expect(screen.getByText(config.name)).toBeInTheDocument();
        });
    });

    test("throws error when useRestaurantConfig is used outside of RestaurantConfigContextProvider", () => {
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        expect(() => render(<TestComponent />)).toThrow(
            "Context must be used within a context provider"
        );

        consoleErrorSpy.mockRestore();
    });
});
