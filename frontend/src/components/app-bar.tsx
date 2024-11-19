import { Button, Navbar, NavbarContent } from "@nextui-org/react";
import { useTheme, useRestaurantConfig } from "@hooks/index.tsx";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTranslation } from "react-i18next";

export default function AppBar() {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { config } = useRestaurantConfig();
    const { t } = useTranslation();

    return (
        <Navbar position="static" maxWidth="full">
            <NavbarContent justify="center">
                <p className="font-bold text-inherit">{config?.name}</p>
            </NavbarContent>
            <NavbarContent justify="end">
                <Button
                    isIconOnly
                    variant="light"
                    onClick={toggleDarkMode}
                    aria-label={t(
                        isDarkMode ? "toggle_light_mode" : "toggle_dark_mode"
                    )}
                >
                    {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
                </Button>
            </NavbarContent>
        </Navbar>
    );
}
