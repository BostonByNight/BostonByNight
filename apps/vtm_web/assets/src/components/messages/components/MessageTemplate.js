// @flow

import React from "react";
import {useTheme} from "@mui/material/styles";
import {useFormik} from "formik";
import Grid from "@mui/material/Grid";
import FormCheckboxField from "../../../_base/components/FormCheckboxField";
import FormTextField from "../../../_base/components/FormTextField";
import Button from "@mui/material/Button";
import {bool, object, string} from "yup";
import type {SubmitProperties} from "../NewMessage";
import CharactersSelectControl from "../../_base/CharactersSelectControl";
import UsersSelectControl from "../../_base/UsersSelectControl";
import type {GenericReactComponent} from "../../../_base/types";

const MessageSchema = object().shape({
    subject: string("Subject: ").required("Required"),
    text: string("Message content: ").required("Required"),
    onGame: bool("Messaggio in game").required("Required"),
    characterId: string("Destinatario").when("onGame", {
        is: true,
        then: string().required("Required")
    }),
    userId: string("Destinatario").when("onGame", {
        is: false,
        then: string().required("Required")
    }),
    // Not necessary, kept for future reference about how to represent a nullable value in the form using yup
    // replyToMessageId: string().nullable(true)
});

type Props = {
    submitted: SubmitProperties => void;
    isReply: boolean;
    characterId?: string;
    userId?: string;
    onGame?: boolean;
    toUserId?: ?string;
    toCharacterId?: ?string;
    subject?: string;
};

const MessageTemplate = ({
                             submitted,
                             isReply,
                             characterId = "",
                             userId = "",
                             toUserId = null,
                             toCharacterId = null,
                             onGame = false,
                             subject = ""
}: Props): GenericReactComponent => {
    const theme = useTheme();

    const cleanInput = (values: SubmitProperties) => {
        if (values.characterId != null && values.characterId !== "") {
            return {
                ...values,
                userId: null
            };
        }

        return values;
    }

    const onSubmit = (values: SubmitProperties) => {
        console.debug("values", values);
        const cleanedInput = cleanInput(values);
        submitted(cleanedInput);
    };

    const inGameOrCharacterNotNull = toCharacterId != null ? true : onGame;

    const formik = useFormik({
        validationSchema: MessageSchema,
        initialValues: {
            subject: subject,
            text: "",
            onGame: inGameOrCharacterNotNull,
            userId: userId === "" ? (toUserId ?? "") : userId,
            characterId: characterId === "" ? (toCharacterId ?? "") : characterId
        },
        onSubmit
    });

    const isInGame = () => formik.values["onGame"];

    const receiverControl = () =>
        isInGame()
            ? (
                <Grid item xs={12} sm={6}>
                    <CharactersSelectControl label="Destinatario"
                                             formik={formik} />
                </Grid>
            )
            : (
                <Grid item xs={12} sm={6}>
                    <UsersSelectControl label="Destinatario"
                                        formik={formik} />
                </Grid>
            );

    const typeSelector = () =>
        isReply
            ? (<></>)
            : (
                <>
                    <Grid item xs={12} sm={6}>
                        <FormCheckboxField formik={formik}
                                           fieldName="onGame"
                                           label="Messaggio in Game?"/>
                    </Grid>
                    {receiverControl()}
                </>
            );

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container>
                {typeSelector()}
                <Grid item xs={12}>
                    <FormTextField formik={formik}
                                   fieldName="subject"
                                   label="Titolo" />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField formik={formik}
                                   fieldName="text"
                                   label="Testo del messaggio"
                                   multiline
                                   minRows={4} />
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth
                            variant="outlined"
                            color="primary"
                            type="submit"
                            sx={{
                                margin: theme.spacing(3, 0, 2),
                            }}>
                        Invia
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default MessageTemplate;
