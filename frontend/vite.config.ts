import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@components": path.resolve(__dirname, "./src/components"),
            "@constants": path.resolve(__dirname, "./src/constants"),
            "@hooks": path.resolve(__dirname, "./src/hooks"),
            "@models": path.resolve(__dirname, "./src/models"),
            "@services": path.resolve(__dirname, "./src/services"),
            "@utils": path.resolve(__dirname, "./src/utils"),
            "@views": path.resolve(__dirname, "./src/views"),
        },
    },
    define: {
        "process.env": process.env,
    },
});
