// @flow

import React, {Suspense, useEffect, useRef, useState} from "react";
import ChatInput from "./controls/ChatInput";
import chatEntryMutationPromise from "../../services/mutations/chat/CreateChatEntryMutation";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import useMap from "../../services/queries/map/MapQuery";
import type {ChatEntry, Map, SessionCharacter} from "../../services/base-types";
import Box from "@mui/material/Box";
import {useRelayEnvironment} from "react-relay";
import type {ChatDiceRequest} from "./controls/ChatThrowDiceInput";
import chatDiceEntryMutationPromise from "../../services/mutations/chat/CreateChatDiceEntry";
import ChatControls from "./controls/ChatControls";
import {Typography} from "@mui/material";
import ChatMasterModal from "./modals/ChatMasterModal";
import ChatDescriptionModal from "./modals/ChatDescriptionModal";
import ChatStatusModal from "./modals/ChatStatusModal";
import {useChatEntries} from "./hooks/ChatEntriesHook";
import ChatScreen from "./screen/ChatScreen";
import DefaultFallback from "../../_base/components/DefaultFallback";
import useChatSubscription from "../_hooks/useChatSubscription";
import {getFileTextFromChatEntries} from "./chat-helpers";
import {downloadFile} from "../../_base/file-utils";
import {useUpdateSessionMap} from "../_hooks/useUpdateSessionMap";
import {useHasUserAccessToMap} from "../../services/queries/map/HasUserAccessToMapQuery";
import {useIsCharacterAwake} from "../../services/queries/character/IsCharacterAwakeQuery";
import type {GenericReactComponent} from "../../_base/types";
import {handleMutation} from "../../_base/utils";
import deleteChatEntryMutation from "../../services/mutations/chat/DeleteChatEntryMutation";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {sessionMapStateAtom} from "../../session/atoms";
import {useCharacterRecoilState} from "../../session/hooks";
import {useDialog} from "../../_base/providers/DialogProvider";
import {useCustomSnackbar} from "../../_base/notification-utils";
import {isUserMasterSelector} from "../../session/selectors";

type ChatProps = {
    map: Map
}

type ShowChatInputProps = {
    character: SessionCharacter;
    characterId: string;
    onNewEntry: string => void;
    onNewDiceEntry: ChatDiceRequest => void;
}

const Chat = ({id}: {id: string}): GenericReactComponent => {
    const map = useMap(id);
    const userHasAccess = useHasUserAccessToMap(id);

    if (map != null && (map.isPrivate === false || userHasAccess)) {
        return (<ChatInternal map={map} />);
    }

    return (
        <h2>
            Non hai accesso a questa chat
        </h2>
    );
};

const ShowChatInput = ({character, characterId, onNewEntry, onNewDiceEntry}: ShowChatInputProps) => {
    const isCharacterAwake = useIsCharacterAwake(characterId, 1);

    if (!isCharacterAwake) {
        return (
            <Typography>
                Devi risvegliare il personaggio per poter giocare. Una volta risvegliato, potresti dover aggiornare
                la pagina.
            </Typography>
        );
    }

    if (character?.approved) {
        return (
            <ChatInput newChatEntry={onNewEntry}
                       newDiceEntry={onNewDiceEntry} />
        );
    }

    return (
        <Typography>
            Il tuo personaggio non &egrave; ancora stato accettato.
        </Typography>
    )
};

const ChatInternal = ({map}: ChatProps): GenericReactComponent => {
    const setLocation = useRef(useSetRecoilState(sessionMapStateAtom));
    const environment = useRelayEnvironment();
    const isUserMaster = useRecoilValue(isUserMasterSelector)
    const [character,] = useCharacterRecoilState()

    const {showDialog} = useDialog()
    const {enqueueSnackbar} = useCustomSnackbar()

    const [mapModalOpen, setMapModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState(map?.name);
    const [modalDescription, setModalDescription] = useState(map?.description);

    const [characterModalOpen, setCharacterModalOpen] = useState(false);
    const [selectedCharacterId, setSelectedCharacterId] = useState<?string>(null);
    const [selectedCharacterName, setSelectedCharacterName] = useState<?string>(null);
    const [characterStatusOpen, setCharacterStatusOpen] = useState(false);

    const initialEntries = useChatEntries(map.id);
    const [entries, setEntries] = useState<Array<ChatEntry>>(initialEntries);

    useChatSubscription(map.id, setEntries);
    useUpdateSessionMap(map.id);

    useEffect(() => {
        if (map?.id != null && setLocation.current) {
            setLocation.current({
                id: map.id,
                name: map?.name
            });
        }
    }, [map])

    const showMapDescription = () => {
        setModalTitle(_ => map?.name);
        setModalDescription(_ => map?.description);
        setMapModalOpen(_ => true);
    };

    const showCharacterDescription = (id: string, name: string) => {
        setSelectedCharacterId(_ => id);
        setSelectedCharacterName(_ => name);
        setCharacterModalOpen(_ => true);
    };

    const deletePhrase = (entryId: string) => {
        if (isUserMaster) {
            showDialog(
                "Cancellazione frase",
                "Sei sicuro di voler cancellare la frase dallo schermo? La frase sarà sempre fruibile nella schermata di storico delle chat",
                () => {
                    handleMutation(
                        () => deleteChatEntryMutation(environment, entryId),
                        enqueueSnackbar,
                        {
                            successMessage: "Frase correttamente cancellata"
                        })
                });
        }
    };

    const createEntry = (action: (string, string) => Promise<any>) => {
        // Bug
        // If the master changes the character on the left hand side menu, being in the chat doesn't update the
        // character in session directly, because here it's a closure.
        const ch = character;

        if (ch?.id != null && map?.id != null) {
            action(ch.id, map.id)
                .catch(error => enqueueSnackbar({ type: 'error', graphqlError: error, message: "An error happened while sending the chat" }));
        }

        if (!ch?.id) {
            enqueueSnackbar({ type: 'error', message: "You must select a character to play."});
        }

        if (!map?.id) {
            enqueueSnackbar({ type: 'error', message: "You're not on a map."});
        }
    };

    const parseEntry = (entry: string): [boolean, string] => {
        const [first,] = entry;

        if (first === "+") {
            return [true, entry.substring(1)];
        }

        return [false, entry];
    };

    const onNewEntry = (entry: string) => {
        if (entry != null && entry !== "") {
            const [offGame, parsedEntry] = parseEntry(entry);

            createEntry((characterId, mapId) =>
                chatEntryMutationPromise(environment, {
                    characterId: characterId,
                    chatMapId: mapId,
                    offGame: offGame,
                    text: parsedEntry,
                }));
        }
    };

    const onNewDiceEntry = (request: ChatDiceRequest) =>
        createEntry((characterId, mapId) =>
            chatDiceEntryMutationPromise(environment, {
                abilityId: request.abilityId,
                attributeId: request.attributeId,
                forDiscipline: request.forDiscipline,
                augmentAttribute: request.augmentAttribute,
                difficulty: request.difficulty,
                freeThrow: request.freeThrow,
                master: request.master,
                characterId: characterId,
                chatMapId: mapId
            }));

    const showChatInput = () => {
        if (character?.id != null) {
            return (
                <ShowChatInput characterId={character.id}
                               character={character}
                               onNewEntry={onNewEntry}
                               onNewDiceEntry={onNewDiceEntry} />
            );
        }

        return (
            <Typography>
                Non hai selezionato nessun personaggio.
            </Typography>
        );
    };

    const downloadChat = () => {
        const fileText = getFileTextFromChatEntries(entries);
        downloadFile("chat.txt", fileText);
    };

    const showChatMasterModal = () => {
        if (selectedCharacterId != null && selectedCharacterName != null) {
            return <ChatMasterModal mapId={map.id}
                                    characterId={selectedCharacterId}
                                    characterName={selectedCharacterName}
                                    closeModal={() => setCharacterModalOpen(_ => false)} />
        }

        return (<></>);
    }

    return (
        <>
            <Dialog open={characterModalOpen && isUserMaster}
                    onClose={_ => setCharacterModalOpen(_ => false)}
                    fullScreen
                    aria-labelledby="character-modal">
                {showChatMasterModal()}
            </Dialog>
            <Dialog open={characterModalOpen && !isUserMaster}
                    onClose={_ => setMapModalOpen(false)}
                    aria-labelledby="character-description">
                <ChatDescriptionModal characterId={selectedCharacterId}
                                        close={() => setCharacterModalOpen(_ => false)} />
            </Dialog>
            <Dialog open={characterStatusOpen}
                    onClose={_ => setCharacterStatusOpen(_ => false)}
                    maxWidth="sm"
                    fullWidth
                    aria-labelledby="character-status">
                <ChatStatusModal characterId={character?.id}
                                    close={() => setCharacterStatusOpen(_ => false)} />
            </Dialog>
            <Dialog open={mapModalOpen}
                    onClose={_ => setMapModalOpen(false)}
                    aria-labelledby="map-info">
                <DialogTitle>
                    {modalTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {modalDescription}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={_ => setMapModalOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Box component="div" sx={{
                display: "flex",
                flexDirection: "column",
                height: "calc(100% - 47px)",
                overflow: "hidden"
            }} id="chat-entries">
                <ChatControls openMapModal={() => showMapDescription()}
                              openCharacterStatusPopup={() => setCharacterStatusOpen(_ => true)}
                              mapId={map.id}
                              onChatLogRequested={downloadChat} />
                <Suspense fallback={<DefaultFallback />}>
                    <ChatScreen entries={entries}
                                showCharacterDescription={showCharacterDescription}
                                canDelete={isUserMaster}
                                deletePhrase={deletePhrase} />
                </Suspense>
                <Box component="div" sx={{
                    flex: "0 1 100px",
                    width: "100%"
                }}>
                    {showChatInput()}
                </Box>
            </Box>
        </>
    );
};

export default Chat;
