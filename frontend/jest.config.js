/** @type {import("ts-jest").JestConfigWithTsJest} **/
export default {
    testEnvironment: "node",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
    testMatch: ["**/*.test.ts", "**/*.test.tsx"],
    testPathIgnorePatterns: ["<rootDir>/node_modules/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.app.json",
        },
    },
    collectCoverage: true,
    moduleNameMapper: {
        "^@components/(.*)$": "<rootDir>/src/components/$1",
        "^@constants/(.*)$": "<rootDir>/src/constants/$1",
        "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
        "^@services/(.*)$": "<rootDir>/src/services/$1",
        "^@models/(.*)$": "<rootDir>/src/models/$1",
        "^@utils/(.*)$": "<rootDir>/src/utils/$1",
        "^@views/(.*)$": "<rootDir>/src/views/$1"
    }
};