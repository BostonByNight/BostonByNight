// @flow

import React, {useContext} from "react";
import {useFormik} from "formik";
import {useHistory} from "react-router-dom";
import {UtilityContext} from "../../contexts";
import {useRelayEnvironment} from "react-relay";
import { MainRoutes } from "../MainRouter";
import ThreadForm, {CreateNewThreadValidationSchema} from "./forms/ThreadForm";
import {useCustomLazyLoadQuery} from "../../_base/relay-utils";
import {getForumThreadQuery} from "../../services/queries/forum/GetForumThreadQuery";
import ModifyThreadMutation from "../../services/mutations/forum/ModifyThreadMutation";
import { handleMutation } from "../../_base/utils";
import type {GenericReactComponent} from "../../_base/types";
import {useSession} from "../../services/session-service";
import {isUserMaster} from "../../services/base-types";

type Props = {
    sectionId: string;
    threadId: string;
};

const ModifyThread = ({sectionId, threadId}: Props): GenericReactComponent => {
    const history = useHistory();
    const environment = useRelayEnvironment();
    const [user,] = useSession();
    const {showUserNotification} = useContext(UtilityContext);
    const thread = useCustomLazyLoadQuery(getForumThreadQuery, {
        forumThreadId: threadId
    })?.getForumThread;

    const goBack = () => history.push(MainRoutes.forumSection(sectionId));

    const onSubmit = ({title, description, highlighted, characterIds}) => {
        handleMutation(() => 
            ModifyThreadMutation(environment, {
                threadId,
                title,
                description,
                highlighted,
                allowedCharacters: characterIds
            }), showUserNotification, {
                successMessage: "Thread modificato.",
                onCompleted: () => {
                    setTimeout(() => {
                        if (threadId != null && threadId !== "") {
                            history.push(MainRoutes.forumThread(threadId));
                        }
                        else {
                            goBack();
                        }
                    }, 500);
                }
            });
    };

    const formik = useFormik({
        initialValues: {
            title: thread?.title,
            description: thread?.description,
            characterIds: thread?.allowedCharacters?.map(x => x?.id) ?? [],
            highlighted: thread?.highlighted
        },
        validationSchema: CreateNewThreadValidationSchema(isUserMaster(user)),
        onSubmit
    });

    const getTitle = () => thread?.title != null
        ? `Modifica thread ${thread.title}`
        : "Modifica thread";

    const getDescription = () => "";

    return (
        <ThreadForm title={getTitle()}
                    description={getDescription()}
                    onGame={thread?.onGame}
                    goBack={goBack}
                    formik={formik}
                    buttonText="Modifica Thread" />
    );
};

export default ModifyThread;
