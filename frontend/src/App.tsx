import "./App.css";
import { useTheme } from "./hooks/use-theme.tsx";
import { Outlet, redirect } from "react-router-dom";
import { SESSION_KEY_PARTY_UUID } from "./constants/session_keys.ts";

export function loader({ request }: { request: Request }) {
    const url = new URL(request.url);
    if (
        sessionStorage.getItem(SESSION_KEY_PARTY_UUID) !== null &&
        !url.pathname.startsWith("/waiting")
    ) {
        return redirect("/waiting");
    } else if (url.pathname === "/") {
        return redirect("/joinWaitlist");
    }
    return null;
}

export default function App() {
    const { isDarkMode } = useTheme();

    return (
        <main
            className={`${isDarkMode ? "dark" : "light"} text-foreground bg-background`}
        >
            <Outlet />
        </main>
    );
}
