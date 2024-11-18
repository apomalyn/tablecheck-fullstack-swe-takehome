import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App, { loader } from "./App.tsx";
import "./utils/i18n.ts";
import ThemeContextProvider from "./hooks/use-theme.tsx";
import RestaurantConfigContextProvider from "./hooks/use-restaurant-config.tsx";
import JoinWaitlistView from "./views/join-waitlist-view.tsx";
import WaitingView, { loader as waitingLoader } from "./views/waiting-view.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        loader,
        children: [
            {
                path: "joinWaitlist",
                element: <JoinWaitlistView />,
            },
            {
                path: "waiting",
                element: <WaitingView />,
                loader: waitingLoader,
            },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <NextUIProvider>
            <ThemeContextProvider>
                <RestaurantConfigContextProvider>
                    <RouterProvider router={router} />
                </RestaurantConfigContextProvider>
            </ThemeContextProvider>
        </NextUIProvider>
    </StrictMode>
);
