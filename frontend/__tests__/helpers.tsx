import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { NextUIProvider } from "@nextui-org/react";
import "@testing-library/jest-dom";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return <NextUIProvider>{children}</NextUIProvider>;
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

/**
 * Mock the i18n module to return the key of the translation
 */
jest.mock("react-i18next", () => ({
    useTranslation: jest.fn().mockImplementation(() => ({
        t: (str: string) => str,
    })),
}));

export * from "@testing-library/react";
export { customRender as render };
