import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import App from "./App.tsx";
import "./utils/i18n.ts";
import ThemeContextProvider from "./hooks/use-theme.tsx";
import RestaurantConfigContextProvider from "./hooks/use-restaurant-config.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <NextUIProvider>
            <ThemeContextProvider>
                <RestaurantConfigContextProvider>
                    <App />
                </RestaurantConfigContextProvider>
            </ThemeContextProvider>
        </NextUIProvider>
    </StrictMode>
);
