// @flow

import React from "react";
import {object, string} from "yup";
import Typography from "@mui/material/Typography";
import {useFormik} from "formik";
import {useAvailablePrivateChats} from "../../services/queries/map/AvailablePrivateChatsQuery";
import Stack from "@mui/material/Stack";
import FormSelectField from "../../_base/components/FormSelectField";
import Box from "@mui/material/Box";
import {useCustomLazyLoadQueryNoVar} from "../../_base/relay-utils";
import {useHasUserAlreadyBooked} from "../../services/queries/chat/HasUserAlreadyBookedQuery";
import Button from "@mui/material/Button";
import {useTheme} from "@mui/material/styles";
import AddUserToChatMutation from "../../services/mutations/chat/AddUserToChatMutation";
import {useRelayEnvironment} from "react-relay";
import {firstOrDefault, isNotNullNorEmpty} from "../../_base/utils";
import {useHistory} from "react-router-dom";
import BookChatMapMutation from "../../services/mutations/chat/BookChatMapMutation";
import {MainRoutes} from "../MainRouter";
import {allPlayersQuery} from "../../services/queries/character/AllPlayersQuery";
import {getAvailableCharactersQuery} from "../../services/queries/chat/GetAvailableCharactersQuery";
import type {GenericReactComponent} from "../../_base/types";
import {useCustomSnackbar} from "../../_base/notification-utils";
import {useWait} from "../../_base/providers/BackdropProvider";
import {useDialog} from "../../_base/providers/DialogProvider";
import {useRecoilValue} from "recoil";
import {sessionStateAtom} from "../../session/atoms";

const numberOfPossibleUsers = 5;

const getShape = () => {
    let shape = {
        chatMapId: string("La chat privata selezionata").required("Richiesto"),
        guest1: string("Il primo ospite").required("Richiesto"),
    };

    for (let i = 2; i <= numberOfPossibleUsers; i++) {
        shape[`guest${i}`] = string("Ospite").nullable().notRequired()
    }

    return shape;
};

const BookChatsFormValidationSchema = object().shape(getShape());

const getInitialObject = () => {
    let initialObject = {
        chatMapId: "",
        guest1: ""
    };

    for (let i = 2; i <= numberOfPossibleUsers; i++) {
        initialObject[`guest${i}`] = "";
    }

    return initialObject;
};

const BookChats = (): GenericReactComponent => {
    const hasUserAlreadyBooked = useHasUserAlreadyBooked();

    if (!hasUserAlreadyBooked) {
        return (<BookChatsInternal />);
    }

    return (
        <h2>
            Hai gi&agrave; prenotato, o sei stato invitato, in un'altra chat privata.
        </h2>
    );
};

const BookChatsInternal = (): GenericReactComponent => {
    const environment = useRelayEnvironment()
    const history = useHistory()
    const {showDialog} = useDialog()
    const {enqueueSnackbar} = useCustomSnackbar()
    const {startWait, stopWait} = useWait()
    const theme = useTheme()
    const user = useRecoilValue(sessionStateAtom)

    const divider = " - ";

    const availablePrivateChats = useAvailablePrivateChats()
        ?.map(m => [m.id, m.name ?? ""]);

    const allowedUsers = useCustomLazyLoadQueryNoVar(getAvailableCharactersQuery, {
        fetchPolicy: "network-only"
    })
        ?.privateChatAvailableUsers
        ?.map(x => x?.id)
        ?.filter(isNotNullNorEmpty) ?? [];

    const allowedUsersMap = new Map(allowedUsers.map(x => [x, true]));

    const allCharacters = useCustomLazyLoadQueryNoVar(allPlayersQuery)
        ?.playersCharactersList
        ?.filter(x => x?.user?.id !== user?.id && x?.user?.id && allowedUsersMap.has(x?.user?.id))
        ?.map(c => [c?.user?.id != null ? `${c?.user?.id}${divider}${c?.id}` : "", c?.name ?? ""]) ?? [];

    const manageError = characterName =>
        e => {
            console.error("There was an error while trying to add user to chat", e);
            enqueueSnackbar({
                type: "error",
                message: `Non è stato possibile invitare il personaggio ${characterName}.`
            });
        };

    const getGuestsTask = (chatId: string, userIds: Array<[string, string]>): Promise<any> => {
        let tasks: Array<Promise<any>> = [];

        for (const [userId, characterName] of userIds) {
            tasks.push(AddUserToChatMutation(environment, chatId, userId).catch(manageError(characterName)));
        }

        return Promise.all(tasks);
    };
    
    const onSubmit = ({chatMapId, guest1, guest2, guest3, guest4, guest5}) => {
        const guests = [guest1, guest2, guest3, guest4, guest5]
            .filter(isNotNullNorEmpty)
            .map(x => {
                const [userId, characterId] = x.split(divider).filter(isNotNullNorEmpty);
                const val = firstOrDefault(allCharacters.filter(([ids, _]) => ids.indexOf(characterId) !== -1));
                const [, characterName] = val ?? [];
                return [userId, characterName];
            });

        const [firstUserId, firstCharacterName] = guests[0];

        showDialog("Prenotazione stanza privata", "Sei sicuro di voler prenotare una stanza privata?",
            () => {
                startWait()

                BookChatMapMutation(environment, chatMapId)
                    .then(_ => AddUserToChatMutation(environment, chatMapId, firstUserId).catch(manageError(firstCharacterName)))
                    .then(_ => getGuestsTask(chatMapId, guests.slice(1)))
                    .then(_ => {
                        enqueueSnackbar({
                            type: "success",
                            message: "La chat è stata prenotata con successo"
                        });
                        setTimeout(() => history.push(MainRoutes.chat(chatMapId)), 1000);
                    })
                    .catch(manageError)
                    .finally(() => stopWait());
            }
        );
    };

    const formik = useFormik({
        initialValues: getInitialObject(),
        validationSchema: BookChatsFormValidationSchema,
        onSubmit
    });

    const characterControls = () => {
        let controls = [];

        for (let i = 1; i <= numberOfPossibleUsers; i++) {
            controls.push(
                <FormSelectField key={i}
                                 formik={formik}
                                 fieldName={`guest${i}`}
                                 label={`Ospite ${i}`}
                                 values={allCharacters}
                                 addNullValue />
            );
        }

        return controls;
    };

    return (
        <>
            <h1 >
                Prenota chat privata
            </h1>

            <Typography paragraph>
                In questa schermata puoi prenotare una stanza privata. La stanza sar&agrave; accessibile solamente a te
                e ai giocatori che deciderai di invitare. Ricordati che la prenotazione durer&agrave; 6 ore, al termine
                delle quali, dovrai ri-prenotare un'altra stanza privata.
            </Typography>

            <Typography paragraph>
                Dovrai invitare almeno un giocatore in questa schermata.
            </Typography>

            <form onSubmit={formik.handleSubmit}>
                <Box component="div" sx={{
                    width: "100%"
                }}>
                    <Stack sx={{
                        maxWidth: {
                            sx: "100%",
                            md: "50%"
                        },
                        margin: "0 auto"
                    }}>
                        <FormSelectField formik={formik}
                                         fieldName="chatMapId"
                                         label="Chat Privata"
                                         values={availablePrivateChats} />

                        {characterControls()}

                        <Button type="submit"
                                fullWidth
                                variant="outlined"
                                color="primary"
                                sx={{
                                    margin: theme.spacing(3, 0, 2),
                                }}>
                            Invia
                        </Button>
                    </Stack>
                </Box>
            </form>
        </>
    );
}

export default BookChats;
