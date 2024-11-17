import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/use-theme.tsx";

interface ICancelModalProps {
    onCancelConfirmed: () => void;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function CancelModal({
    onCancelConfirmed,
    isOpen,
    onOpenChange,
}: ICancelModalProps) {
    const { t } = useTranslation();
    const { isDarkMode } = useTheme();

    return (
        <Modal
            className={`${isDarkMode ? "dark" : "light"} text-foreground bg-content1`}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader />
                        <ModalBody>
                            <p>{t("cancellation_body")}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                {t("cancellation_cancel")}
                            </Button>
                            <Button color="danger" onPress={onCancelConfirmed}>
                                {t("cancellation_confirm")}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
