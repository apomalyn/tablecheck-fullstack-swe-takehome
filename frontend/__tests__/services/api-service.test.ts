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
