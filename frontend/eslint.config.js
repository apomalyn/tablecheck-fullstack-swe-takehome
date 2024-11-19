import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import pluginJest from "eslint-plugin-jest";
import testingLibrary from "eslint-plugin-testing-library";

export default tseslint.config(
    { ignores: ["dist", "coverage"] },
    {
        extends: [
            js.configs.recommended,
            eslintPluginPrettierRecommended,
            ...tseslint.configs.recommendedTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
        ],
        files: ["**/*.{ts,tsx}"],
        ignores: ["vite.config.ts"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                project: ["./tsconfig.node.json", "./tsconfig.app.json"],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            react,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": "off",
            ...react.configs.recommended.rules,
            ...react.configs["jsx-runtime"].rules,
        },
    },
    {
        files: ["**/*.test.ts", "**/*.test.tsx"],
        plugins: { jest: pluginJest },
        extends: [
            pluginJest.configs.recommended,
            testingLibrary.configs.recommended,
        ],
        languageOptions: {
            globals: pluginJest.environments.globals.globals,
        },
        rules: {
            "jest/no-disabled-tests": "warn",
            "jest/no-focused-tests": "error",
            "jest/no-identical-title": "error",
            "jest/prefer-to-have-length": "warn",
            "jest/valid-expect": "error",
        },
    }
);
