// @flow

import React from "react";
import {useHistory} from "react-router-dom";
import {useFormik} from "formik";
import {useRelayEnvironment} from "react-relay";
import {MainRoutes} from "../../../MainRouter";
import ForumPostForm from "../ForumPostForm";
import type {GenericReactComponent} from "../../../../_base/types";
import {CreateNewPostValidationSchema} from "../ManagePost";
import CreateNewPostMutation from "../../../../services/mutations/forum/CreateNewPostMutation";
import {useCustomSnackbar} from "../../../../_base/notification-utils";
import {useRecoilValue} from "recoil";
import {sessionStateAtom} from "../../../../session/atoms";
import {useCharacterRecoilState} from "../../../../session/hooks";

type NewPostProps = {
    threadId: string;
    title: ?string;
}

type SubmitProps = {
    text: string;
}

const NewPost = ({threadId, title}: NewPostProps): GenericReactComponent => {
    const history = useHistory();
    const user = useRecoilValue(sessionStateAtom)
    const [character,] = useCharacterRecoilState()
    const environment = useRelayEnvironment();
    const {enqueueSnackbar} = useCustomSnackbar()

    const onSubmit = ({text}: SubmitProps) => {
        CreateNewPostMutation(environment, {
            forumThreadId: threadId,
            creatorUserId: user?.id ?? "",
            creatorCharacterId: character?.id,
            text: text
        }).then((_: any) => {
            enqueueSnackbar({type: "success", message: "Post creato!"})
        }).catch(e => {
            console.error("Error while saving the post!", e);
            enqueueSnackbar({
                type: "error",
                graphqlError: e,
                message: "Il post non è stato salvato correttamente."
            });
        }).finally(() => {
            setTimeout(() => goBack(), 500);
        })
    };

    const formik = useFormik({
        initialValues: {
            text: ""
        },
        validationSchema: CreateNewPostValidationSchema,
        onSubmit
    })

    const goBack = () => history.push(MainRoutes.forumThread(threadId));

    const getTitle = () => title != null
        ? `Nuovo post in ${title}`
        : "Nuovo post";

    return (<ForumPostForm title={getTitle()}
                           confirmButtonText="Crea post"
                           goBack={goBack}
                           formik={formik} />)
};

export default NewPost;
