import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Link,
    useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppBar, CancelModal } from "@components/index";
import ApiService from "@services/api-service.ts";
import { PARTY_UUID_KEY } from "@constants/storage-keys.ts";
import { IPositionInWaitlist } from "@models/index";
import { routeName as joinWaitingListRouteName } from "@views/join-waitlist-view.tsx";
import { routeName as checkedInRouteName } from "@views/checked-in-view.tsx";

export const routeName = "/waiting";

interface IState {
    position?: IPositionInWaitlist;
    isCheckingIn: boolean;
    title: string;
}

export default function WaitingView() {
    const partyUuid = localStorage.getItem(PARTY_UUID_KEY)!;
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [state, setState] = useState<IState>({
        isCheckingIn: false,
        title: "",
    });

    /**
     * Remove the party from the waitlist then redirect to the join waitlist view.
     */
    function handleCancel() {
        void ApiService.instance
            .cancelPositionInWaitlist(partyUuid)
            .then(() => {
                localStorage.clear();
                navigate(joinWaitingListRouteName);
            });
    }

    function handleCheckin() {
        setState((current) => ({ ...current, isCheckingIn: true }));
        void ApiService.instance
            .checkIn(partyUuid)
            .then(() => {
                localStorage.clear();
                navigate(checkedInRouteName);
            })
            .catch(() => {
                setState((current) => ({ ...current, isCheckingIn: false }));
            });
    }

    /**
     * Update the position received from the EventSource.
     */
    function onPositionReceived(event: IPositionInWaitlist) {
        let newTitle = t("waiting_title", {
            x: event.position,
        });

        if (event.position === 0 && !event.checkInAllowed) {
            newTitle = t("waiting_next");
        } else if (event.checkInAllowed) {
            newTitle = t("waiting_checkin_title");
        }
        setState((current) => ({
            ...current,
            position: event,
            title: newTitle,
        }));
    }

    // Subscribe to the position update.
    useEffect(() => {
        return ApiService.instance.checkPositionInWaitlist(
            localStorage.getItem(PARTY_UUID_KEY)!,
            onPositionReceived
        );
    }, []);

    return (
        <>
            <AppBar />
            <div className="flex h-full items-center justify-center columns-3">
                <Card className="min-w-80">
                    {state.position && (
                        <CardHeader className="flex justify-center">
                            <p className="text-lg">{state.title}</p>
                        </CardHeader>
                    )}
                    <CardBody>
                        <p>
                            {t(
                                state.position?.checkInAllowed
                                    ? "waiting_checkin_body"
                                    : "waiting_body"
                            )}
                        </p>
                    </CardBody>
                    <CardFooter className="flex flex-col justify-center gap-4">
                        {state.position?.checkInAllowed && (
                            <Button
                                color="primary"
                                className="w-full"
                                onClick={handleCheckin}
                                isLoading={state.isCheckingIn}
                            >
                                {t("waiting_checkin")}
                            </Button>
                        )}
                        <Link
                            href="#"
                            onClick={onOpen}
                            color="danger"
                            size="sm"
                        >
                            {t("waiting_cancellation")}
                        </Link>
                    </CardFooter>
                </Card>
            </div>
            <CancelModal
                onCancelConfirmed={handleCancel}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />
        </>
    );
}
