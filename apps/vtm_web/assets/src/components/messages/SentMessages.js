// @flow

import React, {Suspense, useState} from "react";
import {useCustomLazyLoadQuery} from "../../_base/relay-utils";
import {userSentMessagesQuery} from "../../services/queries/messages/UserSentMessagesQuery";
import List from "@mui/material/List";
import MessageListItem from "./components/MessageListItem";
import Button from "@mui/material/Button";
import {MainRoutes} from "../MainRouter";
import {useHistory} from "react-router-dom";
import ButtonGroup from "@mui/material/ButtonGroup";
import {handleMutation} from "../../_base/utils";
import {useRelayEnvironment} from "react-relay";
import DeleteAllSentMessagesMutation from "../../services/mutations/messages/DeleteAllSentMessagesMutation";
import type {GenericReactComponent} from "../../_base/types";
import {useDialog} from "../../_base/providers/DialogProvider";
import {useCustomSnackbar} from "../../_base/notification-utils";

const SentMessages = (): GenericReactComponent => {
    const history = useHistory()
    const environment = useRelayEnvironment()
    const {showDialog} = useDialog()
    const {enqueueSnackbar} = useCustomSnackbar()
    const [fetchKey, setFetchKey] = useState(0)

    const messages = useCustomLazyLoadQuery(userSentMessagesQuery, {}, {
        fetchPolicy: "store-and-network",
        fetchKey: fetchKey
    });

    const messageList = () =>
        (messages?.me?.sentMessages ?? [])
            ?.map(m =>
                m != null
                    ? (<MessageListItem key={m.id} message={{
                        id: m.id,
                        subject: m.subject,
                        onGame: m.onGame,
                        read: m.read,
                        insertedAt: m.insertedAt,
                        modifiedAt: m.modifiedAt,
                        receiverUser: {...m.receiverUser},
                        receiverCharacter: m.receiverCharacter?.id != null
                            ? {...m.receiverCharacter}
                            : null
                    }} />)
                    : <></>);

    const onDeleteAll = (_: any) => {
        showDialog(
            "Cancella tutti i messaggi",
            "Sei sicuro di voler cancellare tutti i tuoi messaggi ricevuti?",
            () => {
                handleMutation(
                    () => DeleteAllSentMessagesMutation(environment),
                    enqueueSnackbar,
                    {
                        successMessage: "I messaggi sono stati cancellati correttamente",
                        onCompleted: () => {
                            setFetchKey(p => p + 1);
                        }
                    });
            }
        )
    };

    return (
        <>
            <div style={{textAlign: "right", padding: "1rem"}}>
                <ButtonGroup>
                    <Button type="submit" onClick={_ => history.push(MainRoutes.newMessage())}>
                        Scrivi nuovo
                    </Button>
                    <Button type="submit" onClick={_ => history.push(MainRoutes.messages)}>
                        Messaggi ricevuti
                    </Button>
                    <Button type="submit" onClick={onDeleteAll}>
                        Cancella tutti
                    </Button>
                </ButtonGroup>
            </div>
            <Suspense fallback={"Loading..."}>
                <List sx={{width: "100%", bgcolor: "background.paper"}}>
                    {messageList()}
                </List>
            </Suspense>
        </>
    );
}

export default SentMessages;
