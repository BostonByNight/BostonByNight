// @flow

import React from "react";
import useForumSections from "../../services/queries/forum/GetForumSectionsQuery";
import {firstOrDefault} from "../../_base/utils";
import {useFormik} from "formik";
import {useHistory} from "react-router-dom";
import CreateNewThreadMutation from "../../services/mutations/forum/CreateNewThreadMutation";
import {useRelayEnvironment} from "react-relay";
import {MainRoutes} from "../MainRouter";
import ThreadForm, {CreateNewThreadValidationSchema} from "./forms/ThreadForm";
import type {GenericReactComponent} from "../../_base/types";
import {useCustomSnackbar} from "../../_base/notification-utils";
import {useRecoilValue} from "recoil";
import {sessionStateAtom} from "../../session/atoms";
import {useCharacterRecoilState} from "../../session/hooks";
import {isUserMasterSelector} from "../../session/selectors";

type Props = {
    sectionId: string;
}

type SubmitProps = {
    title: string,
    description: string,
    highlighted: boolean,
    characterIds: string[]
}

const CreateNewThread = ({sectionId}: Props): GenericReactComponent => {
    const history = useHistory();
    const environment = useRelayEnvironment();
    const {enqueueSnackbar} = useCustomSnackbar()
    const user = useRecoilValue(sessionStateAtom)
    const isUserMaster = useRecoilValue(isUserMasterSelector)
    const [character,] = useCharacterRecoilState()
    const section = firstOrDefault(useForumSections()?.getForumSections?.filter(s => s?.section?.id === sectionId));

    const goBack = () => history.push(MainRoutes.forumSection(sectionId));

    const onSubmit = ({title, description, highlighted, characterIds}: SubmitProps) => {
        CreateNewThreadMutation(environment, {
            sectionId,
            creatorUserId: user?.id ?? "",
            creatorCharacterId: section?.section?.onGame === true ? character?.id : null,
            title,
            description,
            highlighted,
            allowedCharacters: characterIds
        }).then(id => {
            enqueueSnackbar({
                type: "success",
                message: "Nuovo thread creato."
            });

            setTimeout(() => {
                if (id != null && id !== "") {
                    history.push(MainRoutes.forumThread(id));
                }
                else {
                    goBack();
                }
            }, 500);
        }).catch(e => {
            console.error("Remote error", e);
            enqueueSnackbar({
                type: "error",
                graphqlMessage: e,
                message: "Impossibile creare il nuovo thread."
            });
        });
    };

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            characterIds: [],
            highlighted: false
        },
        validationSchema: CreateNewThreadValidationSchema(isUserMaster),
        onSubmit
    });

    const getTitle = () => section?.section?.title != null
        ? `Nuovo thread in ${section.section.title}`
        : "Nuovo thread";

    const getDescription = () =>
        "Prima di inserire un nuovo thread, accertati che non ce ne siano altri già attivi con lo stesso scopo."

    return (
        <ThreadForm title={getTitle()}
                    description={getDescription()}
                    onGame={section?.section?.onGame}
                    goBack={goBack}
                    formik={formik}
                    buttonText="Crea Thread" />
    );
};

export default CreateNewThread;
