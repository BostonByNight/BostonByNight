// @flow

import React from "react";
import {useRelayEnvironment} from "react-relay";
import {useDialog} from "../../../../_base/providers/DialogProvider";
import {useCustomSnackbar} from "../../../../_base/notification-utils";
import {handleMutation} from "../../../../_base/utils";
import ResetOccupationSalaryCheckMutation
    from "../../../../services/mutations/admin/ResetOccupationSalaryCheckMutation";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import type {GenericReactComponent} from "../../../../_base/types";
import type {Character} from "../../../../services/queries/character/GetCharacterCompleteQuery";

type Props = {
    character: Character;
    onUpdate: () => void;
}

const ResetOccupationSalaryCheckForm = ({character, onUpdate}: Props): GenericReactComponent => {
    const environment = useRelayEnvironment()
    const {showDialog} = useDialog()
    const {enqueueSnackbar} = useCustomSnackbar()

    const resetCharacterHunt = () =>
        showDialog(
            "Resetta esito caccia",
            `Sei sicuro di voler resettare l'esito della caccia di ${character?.name ?? ""}?`,
            () => {
                handleMutation(
                    () => ResetOccupationSalaryCheckMutation(environment, {characterId: character?.id}),
                    enqueueSnackbar, {
                        successMessage: "L'esito della caccia è stato correttamente resettato.",
                        onCompleted: onUpdate
                    });
            }
        );

    return (
        <Grid item xs={12} sx={{
            margin: "20px",
            textAlign: "center"
        }}>
            <Button variant="container"
                    onClick={resetCharacterHunt}>
                Resetta il tempo dell'ultima richiesta di stipendio
            </Button>
        </Grid>
    );
}

export default ResetOccupationSalaryCheckForm;
