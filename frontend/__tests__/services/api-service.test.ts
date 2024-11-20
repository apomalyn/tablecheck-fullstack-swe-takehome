import ApiService from "@services/api-service.ts";
import axios, { AxiosInstance } from "axios";
import { IRestaurantConfiguration, IParty } from "@models/index.ts";
import envConfig from "@constants/config.ts";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const axiosInstanceMock = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
};

describe("ApiService", () => {
    let apiService: ApiService;

    beforeAll(() => {
        mockedAxios.create.mockReturnValue(
            axiosInstanceMock as unknown as AxiosInstance
        );
        apiService = ApiService.instance;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getRestaurantConfiguration", () => {
        it("should fetch and return restaurant configuration", async () => {
            const restaurantConfig: IRestaurantConfiguration = {
                name: "Test Restaurant",
                capacity: 100,
                maxPartySize: 10,
            };

            axiosInstanceMock.get.mockResolvedValue({
                data: restaurantConfig,
                status: 200,
            });

            const config = await apiService.getRestaurantConfiguration();
            expect(config).toEqual(restaurantConfig);
            expect(axiosInstanceMock.get).toHaveBeenCalledWith(
                `/restaurants/${envConfig.RESTAURANT_UUID}`,
                expect.any(Object)
            );
        });
    });

    describe("joinWaitlist", () => {
        it("should call /waitlist/:restaurant_uuid/join and return the party", async () => {
            const party: IParty = {
                uuid: "party-uuid",
                name: "John Doe",
                size: 4,
                expiresOn: new Date(),
            };

            axiosInstanceMock.post.mockResolvedValue({
                data: party,
                status: 201,
            });

            const result = await apiService.joinWaitlist(
                party.name,
                party.size
            );
            expect(result).toEqual(party);
            expect(axiosInstanceMock.post).toHaveBeenCalledWith(
                `/waitlist/${envConfig.RESTAURANT_UUID}/join`,
                { name: party.name, party_size: party.size },
                expect.any(Object)
            );
        });
    });

    describe("checkPositionInWaitlist", () => {
        const eventSourceInstanceMock = {
            onmessage: null,
            onerror: null,
            close: jest.fn(),
        };
        const eventSourceMock = jest
            .fn()
            .mockReturnValue(eventSourceInstanceMock);

        (global as any).EventSource = eventSourceMock;

        it("should handle incoming message and transform the data", () => {
            const onDataMock = jest.fn();
            apiService.checkPositionInWaitlist("party-uuid", onDataMock);

            expect(eventSourceMock).toHaveBeenCalled();

            // Extract the onMessage callback
            expect(eventSourceInstanceMock.onmessage).not.toBeNull();
            const onMessageCallback =
                eventSourceInstanceMock.onmessage as unknown as (
                    event: MessageEvent
                ) => void;

            // Send message
            const message = { position: 1, check_in_allowed: false };
            onMessageCallback({
                data: JSON.stringify(message),
            } as MessageEvent);
            expect(onDataMock).toHaveBeenCalledWith({
                position: message.position,
                checkInAllowed: message.check_in_allowed,
            });
            expect(eventSourceInstanceMock.close).not.toHaveBeenCalled();

            // Send end message
            message.check_in_allowed = true;
            onMessageCallback({
                data: JSON.stringify(message),
            } as MessageEvent);
            expect(onDataMock).toHaveBeenCalledWith({
                position: message.position,
                checkInAllowed: message.check_in_allowed,
            });
            expect(eventSourceInstanceMock.close).toHaveBeenCalled();
        });

        it("should no call onData when the message is empty", () => {
            const onDataMock = jest.fn();
            apiService.checkPositionInWaitlist("party-uuid", onDataMock);

            expect(eventSourceMock).toHaveBeenCalled();

            // Extract the onMessage callback
            expect(eventSourceInstanceMock.onmessage).not.toBeNull();
            const onMessageCallback =
                eventSourceInstanceMock.onmessage as unknown as (
                    event: MessageEvent
                ) => void;

            // Send message
            onMessageCallback({
                data: "",
            } as MessageEvent);
            expect(onDataMock).not.toHaveBeenCalled();
            expect(eventSourceInstanceMock.close).not.toHaveBeenCalled();
        });

        it("should close the eventSource on error", () => {
            apiService.checkPositionInWaitlist("party-uuid", jest.fn());

            expect(eventSourceMock).toHaveBeenCalled();

            // Extract the onError callback
            expect(eventSourceInstanceMock.onerror).not.toBeNull();
            const onErrorCallback =
                eventSourceInstanceMock.onerror as unknown as (
                    event: Event
                ) => void;

            // Send error
            onErrorCallback({} as Event);
            expect(eventSourceInstanceMock.close).toHaveBeenCalled();
        });

        it("should close the eventSource when the callback returned is called", () => {
            const callback = apiService.checkPositionInWaitlist(
                "party-uuid",
                jest.fn()
            );

            expect(eventSourceMock).toHaveBeenCalled();

            expect(eventSourceInstanceMock.onerror).not.toBeNull();
            expect(eventSourceInstanceMock.onmessage).not.toBeNull();

            callback();
            expect(eventSourceInstanceMock.close).toHaveBeenCalled();
        });
    });

    describe("cancelPositionInWaitlist", () => {
        it("should send a DELETE /waitlist/:party_uuid", async () => {
            axiosInstanceMock.delete.mockResolvedValue({
                status: 204,
            });

            await apiService.cancelPositionInWaitlist("party-uuid");
            expect(axiosInstanceMock.delete).toHaveBeenCalledWith(
                `/waitlist/party-uuid`,
                expect.any(Object)
            );
        });
    });

    describe("checkIn", () => {
        it("should send a POST /waitlist/:party_uuid/check-in", async () => {
            axiosInstanceMock.post.mockResolvedValue({
                status: 200,
            });

            await apiService.checkIn("party-uuid");
            expect(axiosInstanceMock.post).toHaveBeenCalledWith(
                `/waitlist/party-uuid/check-in`,
                expect.any(Object)
            );
        });
    });
});
