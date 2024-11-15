import "./App.css";
import AppBar from "./components/app-bar.tsx";
import { useTheme } from "./hooks/use-theme.tsx";

function App() {
    const { isDarkMode } = useTheme();
    return (
        <main
            className={`${isDarkMode ? "dark" : "light"} text-foreground bg-background`}
        >
            <AppBar />
        </main>
    );
}

export default App;
