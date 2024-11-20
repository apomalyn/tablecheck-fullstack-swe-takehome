import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@hooks/index.tsx";

interface IErrorModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function ErrorModal({
                                        isOpen,
                                        onOpenChange,
                                    }: IErrorModalProps) {
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
                        <ModalHeader>
                            <p className="text-xl">{t("error_title")}</p>
                        </ModalHeader>
                        <ModalBody>
                            <p>{t("error_try_again")}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={onClose}>
                                {t("ok")}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
