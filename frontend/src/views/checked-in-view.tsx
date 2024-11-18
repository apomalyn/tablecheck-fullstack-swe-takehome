import { AppBar } from "@components/index";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routeName as joinWaitingListRouteName } from "@views/join-waitlist-view.tsx";

export const routeName = "/checked-in";

export default function CheckedInView() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    // Represent the time before redirect
    const [remainingSeconds, setRemainingSeconds] = useState(20);

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

        // Cleanup the interval on unmount
        return () => clearInterval(timerInterval);
    }, []);

    return (
        <>
            <AppBar />
            <div className="flex h-full items-center justify-center columns-3">
                <Card className="min-w-80 gap-0.5">
                    <CardHeader className="justify-center">
                        <p className="text-lg">{t("checked_in_thank_you")}</p>
                    </CardHeader>
                    <CardBody>
                        <p>{t("checked_in_instruction")}</p>
                    </CardBody>
                    <CardFooter className="justify-center">
                        <p className="text-sm">
                            {t("checked_in_redirect", { remainingSeconds })}
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
