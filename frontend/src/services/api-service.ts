/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import {
    IRestaurantConfiguration,
    IPositionInWaitlist,
    IParty,
} from "@models/index.ts";
import axios, { AxiosInstance } from "axios";

export default class ApiService {
    private static _instance: ApiService;

    private static _baseApiUrl = import.meta.env.VITE_API_BASE_URL;
    private static restaurantUuid = import.meta.env.VITE_RESTAURANT_UUID;

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
                transformResponse: (data: string) => {
                    const json = JSON.parse(data);
                    return {
                        name: json.name as string,
                        capacity: json.capacity as number,
                        maxPartySize: json.max_party_size as number,
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
                transformResponse: (data: string) => {
                    const json = JSON.parse(data);
                    return {
                        uuid: json.uuid as string,
                        name: json.name as string,
                        size: json.size as string,
                        expiresOn: new Date(json.expires_on as string),
                    };
                },
            }
        );

        return response.data;
    }

    /**
     * Subscribe to an event source to receive the position in the waitlist
     * regularly.
     *
     * @param partyUuid
     * @param onData callback called when a new message is received.
     * @return callback to close the transmission
     */
    checkPositionInWaitlist(
        partyUuid: string,
        onData: (response: IPositionInWaitlist) => void
    ): () => void {
        const eventSource = new EventSource(
            `${ApiService._baseApiUrl}/waitlist/${partyUuid}`
        );

        // Transform the incoming data into a IPositionInWaitlistResponse before
        // sending it to the view.
        eventSource.onmessage = (event) => {
            if (event.data.length === 0) {
                return;
            }
            const rawJson = JSON.parse(event.data);
            const response: IPositionInWaitlist = {
                position: rawJson.position,
                checkInAllowed: rawJson.check_in_allowed,
            };
            onData(response);

            // If we are ready for checking in, no need to keep the connection alive
            if (response.checkInAllowed) {
                eventSource.close();
            }
        };

        eventSource.onerror = (event) => {
            console.error("Error during SSE. Closing the stream", event);
            eventSource.close();
        };

        return () => eventSource.close();
    }

    async cancelPositionInWaitlist(partyUuid: string): Promise<void> {
        return this.axiosInstance.delete(`/waitlist/${partyUuid}`, {
            validateStatus: function (status: number) {
                // In this specific case, if the party doesn't exist on the API
                // it's not important.
                return status === 204 || status === 404; //
            },
        });
    }

    /**
     * Check in the party.
     */
    async checkIn(partyUuid: string): Promise<void> {
        return this.axiosInstance.post(`waitlist/${partyUuid}/check-in`, {
            validateStatus: function (status: number) {
                // In this specific case, if the party doesn't exist on the API
                // it's not important.
                return status === 200;
            },
        });
    }
}
