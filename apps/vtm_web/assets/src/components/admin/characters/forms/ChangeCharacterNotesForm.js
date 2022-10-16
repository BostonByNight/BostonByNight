// @flow

import React, {useState} from "react";
import type {Character} from "../../../../services/queries/character/GetCharacterCompleteQuery";
import {useRelayEnvironment} from "react-relay";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {handleMutation} from "../../../../_base/utils";
import ChangeCharacterNotesMutation from "../../../../services/mutations/admin/ChangeCharacterNotesMutation";
import type {GenericEvent, GenericReactComponent} from "../../../../_base/types";
import {useDialog} from "../../../../_base/providers/DialogProvider";
import {useCustomSnackbar} from "../../../../_base/notification-utils";

type Props = {
    character: Character;
    onUpdate: () => void;
};

const ChangeCharacterNotesForm = ({character, onUpdate}: Props): GenericReactComponent => {
    const {showDialog} = useDialog()
    const {enqueueSnackbar} = useCustomSnackbar();
    const environment = useRelayEnvironment();

    const [advantages, setAdvantages] = useState(character?.advantages ?? "");
    const [notes, setNotes] = useState(character?.notes ?? "");
    const [disciplinePowers, setDisciplinePowers] = useState(character?.disciplinePowers ?? "");
    const [specialties, setSpecialties] = useState(character?.specialties ?? "");
    const [convictions, setConvictions] = useState(character?.convictions ?? "");

    const onAdvantagesChanged = ({target: {value}}: GenericEvent) => {
        setAdvantages(_ => value);
    };

    const onNotesChanged = ({target: {value}}: GenericEvent) => {
        setNotes(_ => value);
    };

    const onDisciplinePowersChanged = ({target: {value}}: GenericEvent) => {
        setDisciplinePowers(_ => value);
    };

    const onSpecialtiesChanged = ({target: {value}}: GenericEvent) => {
        setSpecialties(_ => value);
    }

    const onConvictionsChanged = ({target: {value}}: GenericEvent) => {
        setConvictions(_ => value);
    };

    const changeCharacterNotes = (_: any) => {
        showDialog(
            `Cambio di status per ${character.name ?? ""}`,
            `Sei sicuro di voler cambiare le note del personaggio?`,
            () => {
                handleMutation(() => ChangeCharacterNotesMutation(environment, {
                    characterId: character.id,
                    advantages,
                    notes,
                    disciplinePowers,
                    specialties,
                    convictions
                }), enqueueSnackbar, {
                    successMessage: "Il personaggio è stato modificato correttamente. Per visualizzare le nuove modifiche, è necessario aggiornare la pagina (F5)",
                    errorMessage: "C'è stato un errore durante la modifica del personaggio, contatta l'admin per maggiori informazioni.",
                    onCompleted: onUpdate
                });
            }
        );
    };

    return (
        <Grid item xs={12}>
            <Grid container>
                <Grid item xs={12} sx={{margin: "10px"}}>
                    <TextField id="advantages"
                               label="Vantaggi"
                               fullWidth
                               multiline
                               rows={3}
                               defaultValue={advantages}
                               onChange={onAdvantagesChanged}
                               variant="filled" />
                </Grid>
                <Grid item xs={12} sx={{margin: "10px"}}>
                    <TextField id="notes"
                               label="Note del Personaggio"
                               fullWidth
                               multiline
                               rows={3}
                               defaultValue={notes}
                               onChange={onNotesChanged}
                               variant="filled" />
                </Grid>
                <Grid item xs={12} sx={{margin: "10px"}}>
                    <TextField id="disciplinePowers"
                               label="Poteri di Disciplina"
                               fullWidth
                               multiline
                               rows={3}
                               defaultValue={disciplinePowers}
                               onChange={onDisciplinePowersChanged}
                               variant="filled" />
                </Grid>
                <Grid item xs={12} sx={{margin: "10px"}}>
                    <TextField id="specialties"
                               label="Specialità"
                               fullWidth
                               multiline
                               rows={3}
                               defaultValue={specialties}
                               onChange={onSpecialtiesChanged}
                               variant="filled" />
                </Grid>
                <Grid item xs={12} sx={{margin: "10px"}}>
                    <TextField id="convictions"
                               label="Convinzioni"
                               fullWidth
                               multiline
                               rows={3}
                               defaultValue={convictions}
                               onChange={onConvictionsChanged}
                               variant="filled" />
                </Grid>
                <Grid item xs={12} sx={{
                    padding: "10px",
                    textAlign: "center"
                }}>
                    <Button variant="outlined"
                            onClick={changeCharacterNotes}>Aggiorna</Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ChangeCharacterNotesForm;
