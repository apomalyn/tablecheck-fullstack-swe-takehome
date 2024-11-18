import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import "@utils/i18n.ts";
import {
    ThemeContextProvider,
    RestaurantConfigContextProvider,
} from "@hooks/index.tsx";
import router from "./router.tsx";

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
