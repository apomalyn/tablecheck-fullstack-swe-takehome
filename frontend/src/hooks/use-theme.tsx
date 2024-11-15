import { createContext, ReactNode, useCallback, useContext, useState } from "react";

interface ThemeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}
interface IProps {
    children: ReactNode;
}
export const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeContextProvider = ({ children }: IProps) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode((prev) => !prev);
    }, [isDarkMode]);
    const value = {
        isDarkMode,
        toggleDarkMode,
    };
    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};
export default ThemeContextProvider;

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === null) {
        throw new Error("Context must be used within a context provider");
    }
    return context;
};