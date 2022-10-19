// @flow

import React, {useState} from "react";
import type {Character} from "../../../../services/queries/character/GetCharacterCompleteQuery";
import {useRelayEnvironment} from "react-relay";
import {handleMutation} from "../../../../_base/utils";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import type {GenericEvent, GenericReactComponent} from "../../../../_base/types";
import {useDialog} from "../../../../_base/providers/DialogProvider";
import {useCustomSnackbar} from "../../../../_base/notification-utils";
import UpdateCharacterMoneyMutation from "../../../../services/mutations/transactions/UpdateCharacterMoneyMutation";
import TextField from "@mui/material/TextField";

type Props = {
    character: Character;
    onUpdate: () => void;
}

const ChangeCharacterMoneyForm = ({character, onUpdate}: Props): GenericReactComponent => {
    const {showDialog} = useDialog()
    const {enqueueSnackbar} = useCustomSnackbar();
    const environment = useRelayEnvironment();

    const [money, setMoney] = useState(character?.money ?? 0);

    const onMoneyChanged = ({target: {value}}: GenericEvent) => {
        setMoney(_ => value);
    };

    const changeCharacterMoney = (_: any) => {
        if (money != null) {
            showDialog(
                `Cambio della quantità di denaro del personaggio`,
                `Sei sicuro di voler cambiare la quantità di denaro a ${money} per ${character.name ?? ""}?`,
                () => {
                    const promise = UpdateCharacterMoneyMutation(environment, {
                        characterId: character.id,
                        money: Number(money)
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
                        <TextField
                            id="money"
                            type="number"
                            label="Denaro"
                            value={money}
                            onChange={onMoneyChanged}
                            sx={{minWidth: "150px"}} />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} sx={{paddingTop: "20px", textAlign: "center"}}>
                    <Button variant="outlined"
                            onClick={changeCharacterMoney}>
                        Cambia denaro
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ChangeCharacterMoneyForm;
