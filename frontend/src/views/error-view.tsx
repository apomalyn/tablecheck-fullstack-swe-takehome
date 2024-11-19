import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { routeName as joinWaitingListRouteName } from "@views/join-waitlist-view.tsx";
import AppBar from "@components/app-bar.tsx";
import { useTheme } from "@hooks/use-theme.tsx";

export default function ErrorView() {
    const { isDarkMode } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    // Represent the time before redirect
    const [remainingSeconds, setRemainingSeconds] = useState(10);

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setRemainingSeconds((prevTime) => {
                if (prevTime === 0) {
                    clearInterval(timerInterval);
                    // Redirect
                    navigate(joinWaitingListRouteName);
                    return 0;
                } else {
                    return prevTime - 1;
                }
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, []);

    return (
        <main
            className={`${isDarkMode ? "dark" : "light"} text-foreground bg-background`}
        >
            <AppBar />
            <div className="flex flex-col h-full items-center justify-center columns-3 gap-8">
                <h1 className="text-6xl">{t("error_title")}</h1>
                <div>
                    <p>{t("error")}</p>
                    <p>{t("error_redirect", { remainingSeconds })}</p>
                </div>
            </div>
        </main>
    );
}
