// @flow

import React, {useRef, useState} from "react";
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import FormFileDropField from "../../_base/components/FormFileDropField";
import FormTextField from "../../_base/components/FormTextField";
import {object, string} from "yup";
import {useFragment, useRelayEnvironment} from "react-relay";
import {
    characterConcealedInfoFragment,
    characterOffFragment,
    characterSheetFragment
} from "../../services/queries/character/CharacterFragments";
import {useFormik} from "formik";
import Typography from "@mui/material/Typography";
import {mainFontFamily} from "../Main.Layout.Style";
import {useCustomLazyLoadQuery} from "../../_base/relay-utils";
import {getCharacterQuery} from "../../services/queries/character/GetCharacterQuery";
import {useUserCharactersQuery} from "../../services/queries/accounts/UserCharactersQuery";
import {Redirect, useHistory} from "react-router-dom";
import ChangeCharacterSheetInfoMutation from "../../services/mutations/characters/ChangeCharacterSheetInfoMutation";
import {MainRoutes} from "../MainRouter";
import {getUrlValidationMatchString} from "../../_base/utils";
import {avatarHeight, avatarWidth} from "./sheet-sections/sections/CharacterSheetAvatarSection";
import type {GenericReactComponent} from "../../_base/types";
import {useCustomSnackbar} from "../../_base/notification-utils";
import {sessionStateAtom} from "../../session/atoms";
import {useRecoilValue} from "recoil";
import type {
    ChangeSheetInfoRequest
} from "../../services/mutations/characters/__generated__/ChangeCharacterSheetInfoMutation.graphql";

type Props = {
    id: string;
}

const urlNotMatchingErrorMessage = "L'URL che stai utilizzando è invalido";

const ModifyCharacterValidationSchema = object().shape({
    description: string("Descrizione del personaggio").required(),
    avatar: string("Il tuo avatar").nullable().matches(getUrlValidationMatchString(), urlNotMatchingErrorMessage).notRequired(),
    biography: string("Biografia del personaggio").required(),
    objects: string("Oggetti posseduti dal personaggio").nullable().notRequired(),
    soundtrack: string("Soundtrack").nullable().matches(getUrlValidationMatchString(), urlNotMatchingErrorMessage).notRequired(),
    off: string("Off").nullable().notRequired()
});

const ModifyCharacterSheet = ({id}: Props): GenericReactComponent => {
    const history = useHistory();
    const {enqueueSnackbar} = useCustomSnackbar()
    const environment = useRelayEnvironment();

    const [chatAvatar, setChatAvatar] = useState<?string>(null);

    const user = useRecoilValue(sessionStateAtom)
    const userCharacters = useUserCharactersQuery();
    const character = useCustomLazyLoadQuery(getCharacterQuery, {id})?.getCharacter;

    const formRef = useRef();

    const sheet = useFragment(
        characterSheetFragment,
        character);

    const concealedSheetInfo = useFragment(
        characterConcealedInfoFragment,
        character);

    const offSheet = useFragment(
        characterOffFragment,
        character);

    const onSubmit = (values: ChangeSheetInfoRequest) => {
        const completeValues: ChangeSheetInfoRequest = chatAvatar != null
            ? {
                ...values,
                chatAvatar
            }
            : values;

        ChangeCharacterSheetInfoMutation(environment, id, completeValues)
            .then(c => {
                if (c != null) {
                    enqueueSnackbar({type: "success", message: "Il personaggio è stato salvato correttamente"});
                }
            })
            .catch(e => {
                console.error("Error while saving character info", e);
                enqueueSnackbar({type: "error", message: "C'è stato un errore salvando il personaggio."});
            })
            .finally(() => {
                history.push(MainRoutes.sheet(id, true));
                // setTimeout(() => document.location.reload(false), 200);
            });
    }

    const formik = useFormik({
        validationSchema: ModifyCharacterValidationSchema,
        initialValues: {
            description: sheet?.description ?? "",
            biography: concealedSheetInfo?.biography ?? "",
            objects: concealedSheetInfo?.objects ?? "",
            avatar: sheet?.avatar ?? "",
            soundtrack: offSheet?.soundtrack ?? "",
            off: offSheet?.off ?? ""
        },
        onSubmit
    });

    const avatarChanged = (_a: ?string, ca: ?string) => {
        setChatAvatar(ca);
    };

    const formSectionStyle = {
        margin: "10px"
    }

    if (!user?.role === "master" && userCharacters?.some(c => c.id === character?.id) === false) {
        return (
            <Redirect to={MainRoutes.sheet(id)} />
        );
    }

    return (
        <form ref={formRef} noValidate onSubmit={formik.handleSubmit}>
            <Grid item xs={12} sx={formSectionStyle}>
                <Typography sx={{
                    ...mainFontFamily,
                    fontSize: "2rem",
                    margin: "20px"
                }}>
                    Modifica il tuo personaggio
                </Typography>
            </Grid>
            <Grid item xs={12} sx={formSectionStyle}>
                <Typography sx={{
                    ...mainFontFamily,
                    fontSize: "0.9rem",
                    color: "primary.light",
                    margin: "20px"
                }}>
                    Puoi specificare un'immagine per rappresentare il tuo personaggio in chat. L'immagine deve essere
                    quadrata, e sar&agrave; automaticamente ridimensionata ad una dimensione di 50x50.
                </Typography>
            </Grid>
            <Grid item xs={12} sx={formSectionStyle}>
                <FormFileDropField fieldName="avatar"
                                   changed={avatarChanged}
                                   showChatPreviews={true}
                                   showLargePreview={false} />
            </Grid>
            <Grid item xs={12}>
                <FormTextField formik={formik} fieldName="avatar" label={`URL Avatar Scheda (${avatarWidth} * ${avatarHeight})`} autoComplete="Avatar URL" />
            </Grid>
            <Grid item xs={12} sx={formSectionStyle}>
                <FormTextField formik={formik} fieldName="description" label="Descrizione" autoComplete="Descrizione" rows={5} />
            </Grid>
            <Grid item xs={12} sx={formSectionStyle}>
                <FormTextField formik={formik} fieldName="biography" label="Biografia" autoComplete="Biografia" rows={5} />
            </Grid>
            <Grid item xs={12} sx={formSectionStyle}>
                <FormTextField formik={formik} fieldName="objects" label="Oggetti" autoComplete="Oggetti" rows={5} />
            </Grid>
            <Grid item xs={12}>
                <FormTextField formik={formik} fieldName="soundtrack" label="Soundtrack" autoComplete="Soundtrack" />
            </Grid>
            <Grid item xs={12} sx={formSectionStyle}>
                <Typography paragraph>
                    Nella sezione Off potete mettere tutto ci&ograve; che volete condividere del vostro personaggio
                    col resto dei giocatori. Si consiglia di non condividere troppe informazioni del personaggio per
                    evitare <i>metaplay</i>.
                    Il testo, ad ogni modo, non è libero: potrete utilizzare i tag messi a disposizione dal markdown
                    concesso. Potete trovare la documentazione completa del markdown concessa al
                    seguente <a href="https://commonmark.org/help/"
                              target="_blank"
                              rel="noreferrer">link</a>, e un esempio al
                    seguente <a href="https://remarkjs.github.io/react-markdown/"
                             target="_blank"
                             rel="noreferrer">link</a>.
                </Typography>
            </Grid>
            <Grid item xs={12} sx={formSectionStyle}>
                <FormTextField formik={formik} fieldName="off" label="Testo Sezione Off" autoComplete="Testo Sezione Off" rows={15} />
            </Grid>
            <Grid item xs={12} sx={formSectionStyle}>
                <Button type="submit"
                        variant="outlined"
                        color="primary">
                    Salva
                </Button>
            </Grid>
        </form>
    );
}

export default ModifyCharacterSheet;
