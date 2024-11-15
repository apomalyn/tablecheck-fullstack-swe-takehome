import IRestaurantConfiguration from "../models/restaurant-configuration.ts";

export default class ApiService {
    static _instance: ApiService;

    private constructor() { }

    public static get instance(): ApiService {
        if (!ApiService._instance) {
            ApiService._instance = new ApiService();
        }

        return ApiService._instance;
    }

    async getRestaurantConfiguration(): Promise<IRestaurantConfiguration> {
        // TODO fetch
        return {
            name: "My little Café",
            maxSeating: 10,
        };
    }
}
