import { Button, Navbar, NavbarContent } from "@nextui-org/react";
import { useTheme, useRestaurantConfig } from "../hooks";
import { MdDarkMode, MdLightMode } from "react-icons/md";

export default function AppBar() {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { config } = useRestaurantConfig();

    return (
        <Navbar position="static" maxWidth="full">
            <NavbarContent justify="center">
                <p className="font-bold text-inherit">{config?.name}</p>
            </NavbarContent>
            <NavbarContent justify="end">
                <Button isIconOnly variant="light" onClick={toggleDarkMode}>
                    {isDarkMode ? <MdDarkMode /> : <MdLightMode />}
                </Button>
            </NavbarContent>
        </Navbar>
    );
}
