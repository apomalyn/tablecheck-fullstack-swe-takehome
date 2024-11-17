import "./App.css";
import { useTheme } from "./hooks/use-theme.tsx";
import JoinWaitlist from "./views/join-waitlist.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <JoinWaitlist />,
    },
]);

function App() {
    const { isDarkMode } = useTheme();

    return (
        <main
            className={`${isDarkMode ? "dark" : "light"} text-foreground bg-background`}
        >
            <RouterProvider router={router} />
        </main>
    );
}

export default App;
