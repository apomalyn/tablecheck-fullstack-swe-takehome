import { Button, Navbar, NavbarContent } from "@nextui-org/react";
import { useTheme } from "../hooks/use-theme.tsx";
import { MdDarkMode, MdLightMode } from "react-icons/md";

export default function AppBar() {
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <Navbar position="static" maxWidth="full">
            <NavbarContent justify="end">
                <Button isIconOnly variant="light" onClick={toggleDarkMode}>
                    {isDarkMode ? <MdDarkMode /> : <MdLightMode />}
                </Button>
            </NavbarContent>
        </Navbar>
    );
}
