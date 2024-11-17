import IRestaurantConfiguration from "../models/restaurant-configuration.ts";
import { IPositionInWaitlistResponse } from "../models/position-in-waitlist-response.ts";
import axios, { AxiosInstance } from "axios";
import IParty from "../models/party.ts";

export default class ApiService {
    private static _instance: ApiService;

    // TODO move those two into environment.
    private static _baseApiUrl = "http://localhost:3000";
    private static restaurantUuid = "673a017eee706b33b11424ed";

    private axiosInstance: AxiosInstance;

    private constructor() {
        this.axiosInstance = axios.create({
            baseURL: ApiService._baseApiUrl,
        });
    }

    public static get instance(): ApiService {
        if (!ApiService._instance) {
            ApiService._instance = new ApiService();
        }

        return ApiService._instance;
    }

    async getRestaurantConfiguration(): Promise<IRestaurantConfiguration> {
        const response = await this.axiosInstance.get<IRestaurantConfiguration>(
            `/restaurants/${ApiService.restaurantUuid}`,
            {
                validateStatus: function (status) {
                    return status === 200;
                },
                transformResponse: (data) => {
                    const json = JSON.parse(data);
                    return {
                        name: json.name,
                        capacity: json.capacity,
                        maxPartySize: json.max_party_size,
                    };
                },
            }
        );

        return response.data;
    }

    /**
     * Add the party to the waitlist.
     */
    async joinWaitlist(name: string, partySize: number): Promise<IParty> {
        const response = await this.axiosInstance.post<IParty>(
            `/waitlist/${ApiService.restaurantUuid}/join`,
            {
                name,
                party_size: partySize,
            },
            {
                validateStatus: function (status: number) {
                    return status === 201;
                },
                transformResponse: (data) => {
                    const json = JSON.parse(data);
                    return {
                        uuid: json.uuid,
                        name: json.name,
                        size: json.size,
                        expiresOn: json.expires_on,
                    };
                },
            }
        );

        return response.data;
    }

    async checkPositionInWaitlist(): Promise<IPositionInWaitlistResponse> {
        return Promise.resolve({
            position: 1,
        });
    }

    async cancelPositionInWaitlist(partyUuid: string): Promise<void> {
        return this.axiosInstance.delete(`/waitlist/${partyUuid}`, {
            validateStatus: function (status: number) {
                return status === 204;
            },
        });
    }
}
