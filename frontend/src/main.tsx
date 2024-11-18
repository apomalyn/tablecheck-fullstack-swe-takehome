import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App, { loader } from "./App.tsx";
import "./utils/i18n.ts";
import ThemeContextProvider from "./hooks/use-theme.tsx";
import RestaurantConfigContextProvider from "./hooks/use-restaurant-config.tsx";
import {
    JoinWaitlistView,
    joinWaitlistRouteName,
    WaitingView,
    waitingRouteName,
    CheckedInView,
    checkedInRouteName,
} from "./views";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        loader,
        children: [
            {
                path: joinWaitlistRouteName.slice(1),
                element: <JoinWaitlistView />,
            },
            {
                path: waitingRouteName.slice(1),
                element: <WaitingView />,
            },
            {
                path: checkedInRouteName.slice(1),
                element: <CheckedInView />,
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
