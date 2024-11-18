import { useTranslation } from "react-i18next";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Input,
} from "@nextui-org/react";
import { useState, ChangeEvent } from "react";
import { useRestaurantConfig } from "@hooks/index";
import { AppBar } from "@components/index";
import ApiService from "@services/api-service.ts";
import { useNavigate } from "react-router-dom";
import {
    PARTY_EXPIRES_ON_KEY,
    PARTY_UUID_KEY,
} from "@constants/storage-keys.ts";

export const routeName = "/join-waitlist";

interface IState {
    name: {
        value: string;
        isInvalid?: boolean;
    };
    partySize: {
        value: number;
        isInvalid?: boolean;
    };
    isSubmitting: boolean;
}

export default function JoinWaitlistView() {
    const { t } = useTranslation();
    const { config } = useRestaurantConfig();
    const navigate = useNavigate();
    const [state, setState] = useState<IState>({
        name: {
            value: "",
        },
        partySize: {
            value: 1,
            isInvalid: false,
        },
        isSubmitting: false,
    });

    function onNameChange(event: ChangeEvent<HTMLInputElement>) {
        setState((current) => ({
            ...current,
            name: {
                value: event.target.value,
                isInvalid: event.target.value.length === 0,
            },
        }));
    }

    function onPartySizeChange(event: ChangeEvent<HTMLInputElement>) {
        const partySize = Number.parseInt(event.target.value);

        setState((current) => ({
            ...current,
            partySize: {
                value: partySize,
                isInvalid: isNaN(partySize)
                    ? true
                    : partySize < 1 || partySize > config!.maxPartySize,
            },
        }));
    }

    function onSubmit() {
        setState((current) => ({
            ...current,
            isSubmitting: true,
        }));
        void ApiService.instance
            .joinWaitlist(state.name.value, state.partySize.value)
            .then((result) => {
                localStorage.setItem(PARTY_UUID_KEY, result.uuid);
                localStorage.setItem(
                    PARTY_EXPIRES_ON_KEY,
                    result.expiresOn.toUTCString()
                );
                navigate("/waiting");
            })
            .catch((err) => {
                // TODO handle error
                console.log(err);
                setState((current) => ({ ...current, isSubmitting: false }));
            });
    }

    return (
        <>
            <AppBar />
            <div className="flex h-full items-center justify-center columns-3">
                <Card>
                    <CardHeader>
                        <p className="font-bold text-lg">
                            {t("join_waitlist_title")}
                        </p>
                    </CardHeader>
                    <form name={"join-waitlist"}>
                        <CardBody className="min-w-80 gap-4">
                            <Input
                                name="name"
                                type="text"
                                autoComplete="name"
                                label={t("join_waitlist_name")}
                                labelPlacement="outside"
                                placeholder={t(
                                    "join_waitlist_name_placeholder"
                                )}
                                value={state.name.value}
                                onChange={onNameChange}
                                isInvalid={state.name.isInvalid}
                                readOnly={state.isSubmitting}
                                isRequired
                            />
                            <Input
                                name="party_size"
                                type="number"
                                label={t("join_waitlist_party_size")}
                                labelPlacement="outside"
                                min={1}
                                max={10}
                                value={state.partySize.value.toString()}
                                onChange={onPartySizeChange}
                                isInvalid={state.partySize.isInvalid}
                                errorMessage={t(
                                    "join_waitlist_party_size_error",
                                    {
                                        max: config?.maxPartySize,
                                    }
                                )}
                                readOnly={state.isSubmitting}
                                isRequired
                            />
                        </CardBody>
                        <CardFooter>
                            <Button
                                color="primary"
                                className="w-full"
                                onClick={onSubmit}
                                isLoading={state.isSubmitting}
                                isDisabled={
                                    (state.name.isInvalid &&
                                        state.partySize.isInvalid) ??
                                    true
                                }
                            >
                                {t("join_waitlist_submit")}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </>
    );
}
