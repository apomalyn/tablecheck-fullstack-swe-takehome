import "./App.css";
import AppBar from "./components/app-bar.tsx";
import { useTheme } from "./hooks/use-theme.tsx";
import JoinWaitlist from "./views/join-waitlist.tsx";
import RestaurantConfigContextProvider from "./hooks/use-restaurant-config.tsx";

function App() {
    const { isDarkMode } = useTheme();

    return (
        <main
            className={`${isDarkMode ? "dark" : "light"} text-foreground bg-background`}
        >
            <RestaurantConfigContextProvider>
                <AppBar />
                <JoinWaitlist />
            </RestaurantConfigContextProvider>
        </main>
    );
}

export default App;
