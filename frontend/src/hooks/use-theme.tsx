import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from "react";

interface ThemeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

interface IProps {
    children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export default function ThemeContextProvider({ children }: IProps) {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode((prev) => !prev);
    }, [isDarkMode]);

    return (
        <ThemeContext.Provider
            value={{
                isDarkMode,
                toggleDarkMode,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === null) {
        throw new Error("Context must be used within a context provider");
    }
    return context;
}
