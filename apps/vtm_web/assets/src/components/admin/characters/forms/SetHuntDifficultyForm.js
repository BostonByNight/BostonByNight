// @flow

import React, {useState} from "react";
import type {Character} from "../../../../services/queries/character/GetCharacterCompleteQuery";
import {useRelayEnvironment} from "react-relay";
import {handleMutation, range} from "../../../../_base/utils";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import ChangeCharacterHuntDifficultyMutation
    from "../../../../services/mutations/admin/ChangeCharacterHuntDifficultyMutation";
import type {GenericEvent, GenericReactComponent} from "../../../../_base/types";
import {useDialog} from "../../../../_base/providers/DialogProvider";
import {useCustomSnackbar} from "../../../../_base/notification-utils";

type Props = {
    character: Character;
    onUpdate: () => void;
}

const SetHuntDifficultyForm = ({character, onUpdate}: Props): GenericReactComponent => {
    const {showDialog} = useDialog()
    const {enqueueSnackbar} = useCustomSnackbar();
    const environment = useRelayEnvironment();

    const [huntDifficulty, setHuntDifficulty] = useState(character?.huntDifficulty);

    const onHuntDifficultyChanged = ({target: {value}}: GenericEvent) => {
        setHuntDifficulty(_ => value);
    };

    const possibleValuesOptions = () => {
        const options = [];

        for (let i of range(0, 6)) {
            options.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
        }

        return options;
    };

    const changeCharacterHuntDifficulty = (_: any) => {
        if (huntDifficulty != null) {
            showDialog(
                `Cambio della difficoltà di caccia`,
                `Sei sicuro di voler cambiare la difficoltà di caccia a ${huntDifficulty} per ${character.name ?? ""}?`,
                () => {
                    const promise = ChangeCharacterHuntDifficultyMutation(environment, {
                        characterId: character.id,
                        huntDifficulty
                    });

                    handleMutation(() => promise, enqueueSnackbar, {
                        successMessage: "Il personaggio è stato modificato correttamente. Per visualizzare le nuove modifiche, è necessario aggiornare la pagina (F5)",
                        errorMessage: "C'è stato un errore durante la modifica del personaggio, contatta l'admin per maggiori informazioni.",
                        onCompleted: onUpdate
                    });
                }
            );
        }
    };

    return (
        <Grid item xs={12}>
            <Grid container>
                <Grid item xs={12} sm={6} sx={{textAlign: "center"}}>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel htmlFor="experience">Difficolt&agrave; della caccia</InputLabel>
                        <Select defaultValue={character?.huntDifficulty}
                                id="huntDifficulty"
                                label="Difficoltà della caccia"
                                onChange={onHuntDifficultyChanged}
                                sx={{minWidth: "150px"}}>
                            {possibleValuesOptions()}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} sx={{paddingTop: "20px", textAlign: "center"}}>
                    <Button variant="outlined"
                            onClick={changeCharacterHuntDifficulty}>
                        Cambia Difficolt&agrave; della Caccia
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SetHuntDifficultyForm;
