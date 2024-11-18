import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App, { loader } from "./App.tsx";
import "./utils/i18n.ts";
import { ThemeContextProvider, RestaurantConfigContextProvider } from "./hooks";
import {
    JoinWaitlistView,
    joinWaitlistRouteName,
    WaitingView,
    waitingRouteName,
    CheckedInView,
    checkedInRouteName,
    ErrorView,
} from "./views";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorView />,
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
