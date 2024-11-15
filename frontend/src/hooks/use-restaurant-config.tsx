import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import IRestaurantConfiguration from "../models/restaurant-configuration.ts";
import ApiService from "../services/api-service.ts";

interface RestaurantConfigContextType {
    config?: IRestaurantConfiguration;
}

interface IProps {
    children: ReactNode;
}

export const RestaurantConfigContext =
    createContext<RestaurantConfigContextType | null>(null);

export default function RestaurantConfigContextProvider({ children }: IProps) {
    const [config, setConfig] = useState<IRestaurantConfiguration>();

    async function init(): Promise<void> {
        await ApiService.instance.getRestaurantConfiguration().then((value) => {
            setConfig(value);
        });
    }

    useEffect(() => {
        void init();
    }, []);

    return (
        <RestaurantConfigContext.Provider value={{ config }}>
            {children}
        </RestaurantConfigContext.Provider>
    );
}

export function useRestaurantConfig() {
    const context = useContext(RestaurantConfigContext);

    if (context === null) {
        throw new Error("Context must be used within a context provider");
    }
    return context;
}
