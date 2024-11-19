import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { NextUIProvider } from "@nextui-org/react";

const AllTheProviders = ({children}: {children: React.ReactNode})  => {
    return <NextUIProvider>{children}</NextUIProvider>;
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
