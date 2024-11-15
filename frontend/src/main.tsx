import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./utils/i18n.ts";
import { NextUIProvider } from "@nextui-org/react";
import ThemeContextProvider from "./hooks/use-theme.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <NextUIProvider>
            <ThemeContextProvider>
                <App />
            </ThemeContextProvider>
        </NextUIProvider>
    </StrictMode>
);
