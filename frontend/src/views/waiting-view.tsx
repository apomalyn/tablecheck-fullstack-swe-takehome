import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Link,
    useDisclosure,
} from "@nextui-org/react";
import AppBar from "../components/app-bar.tsx";
import ApiService from "../services/api-service.ts";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CancelModal from "../components/cancel-modal.tsx";
import { PARTY_UUID_KEY } from "../constants/storage-keys.ts";

export function loader() {
    return null;
}

export default function WaitingView() {
    const navigate = useNavigate();

    const { t } = useTranslation();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    /**
     * Remove the party from the waitlist then redirect to the join waitlist view.
     */
    function handleCancel() {
        void ApiService.instance
            .cancelPositionInWaitlist(localStorage.getItem(PARTY_UUID_KEY)!)
            .then(() => {
                localStorage.clear();
                navigate("/joinWaitlist");
            });
    }

    return (
        <>
            <AppBar />
            <div className="flex h-full items-center justify-center columns-3">
                <Card>
                    <CardHeader className="flex justify-center">
                        <p className="text-lg">
                            {t("waiting_subtitle", {
                                x: 1,
                            })}
                        </p>
                    </CardHeader>
                    <CardBody className="flex ">
                        <p>{t("waiting_title")}</p>
                    </CardBody>
                    <Divider />
                    <CardFooter className="flex justify-center">
                        <Link href="#" onClick={onOpen} color="danger">
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
