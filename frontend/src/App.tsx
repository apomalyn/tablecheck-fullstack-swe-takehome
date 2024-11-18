import "./App.css";
import { useTheme } from "./hooks/use-theme.tsx";
import { Outlet, redirect } from "react-router-dom";
import {
    PARTY_EXPIRES_ON_KEY,
    PARTY_UUID_KEY,
} from "./constants/storage-keys.ts";
import { joinWaitlistRouteName, waitingRouteName } from "./views";

export function loader({ request }: { request: Request }) {
    const url = new URL(request.url);
    const uuid = localStorage.getItem(PARTY_UUID_KEY);
    const expiresOn = Date.parse(
        localStorage.getItem(PARTY_EXPIRES_ON_KEY) ?? ""
    );
    const now = Date.now();
    if (
        uuid !== null &&
        !url.pathname.startsWith(waitingRouteName) &&
        expiresOn > now
    ) {
        return redirect(waitingRouteName);
    } else if (url.pathname === "/") {
        localStorage.clear();
        return redirect(joinWaitlistRouteName);
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
