import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

export default {
    content: [
        "./src/**/*.{ts,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        nextui({
            defaultTheme: "light",
            themes: {
                light: {
                    colors: {
                        foreground: "#0f092a",
                        background: "#e9e5fa",
                        primary: { DEFAULT: "#2c1971", foreground: "#e9e5fa" },
                        secondary: "#e170b5",
                        focus: "#c92c4b",
                    },
                },
                dark: {
                    colors: {
                        foreground: "#dbd5f6",
                        background: "#09051a",
                        primary: { DEFAULT: "#a18ee6", foreground: "#09051a" },
                        secondary: "#8f1e64",
                        focus: "#d33656",
                    },
                },
            },
        }),
    ],
    darkMode: "class",
} satisfies Config;
