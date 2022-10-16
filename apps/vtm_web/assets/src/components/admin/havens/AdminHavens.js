// @flow

import React from "react";
import HavenMap from "../../_base/HavenMap";
import AdminHavensModal from "./AdminHavensModal";
import type {Haven} from "../../../services/queries/haven/GetHavensQuery";
import SetHavenCharacterMutation from "../../../services/mutations/havens/SetHavenCharacterMutation";
import {useRelayEnvironment} from "react-relay";
import {handleMutation, isNullOrEmpty, tryCastToOneType} from "../../../_base/utils";
import DeleteHavenCharacterMutation from "../../../services/mutations/havens/DeleteHavenCharacterMutation";
import type {GenericReactComponent} from "../../../_base/types";
import SetHavenInfoMutation from "../../../services/mutations/havens/SetHavenInfoMutation";
import SetResonanceZoneMutation from "../../../services/mutations/havens/SetResonanceZoneMutation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ResetResonancesMutation from "../../../services/mutations/havens/ResetResonancesMutation";
import SetDangerZoneMutation from "../../../services/mutations/havens/SetDangerZoneMutation";
import Grid from "@mui/material/Grid";
import ResetDangerMutation from "../../../services/mutations/havens/ResetDangerMutation";
import {useDialog} from "../../../_base/providers/DialogProvider";
import {useCustomSnackbar} from "../../../_base/notification-utils";
import type {
    SetHavenInfoRequest,
} from "../../../services/mutations/havens/__generated__/SetHavenInfoMutation.graphql";
import type {
    SetResonanceZoneRequest
} from "../../../services/mutations/havens/__generated__/SetResonanceZoneMutation.graphql";
import type {
    SetDangerZoneRequest
} from "../../../services/mutations/havens/__generated__/SetDangerZoneMutation.graphql";

const AdminHavens = (): GenericReactComponent => {
    const environment = useRelayEnvironment();
    const {showDialog} = useDialog()
    const {enqueueSnackbar} = useCustomSnackbar()

    const [haven, setHaven] = React.useState<?Haven>(null);
    const [fetchKey, setFetchKey] = React.useState(0);
    const [open, setOpen] = React.useState<boolean>(false);

    const onHavenSelected = (h: Haven | string) => {
        const haven = tryCastToOneType<Haven, string>(h);

        if (haven != null) {
            setHaven(_ => haven);
            setOpen(_ => true);
        }
    };

    const onCharacterSubmitted = (h: ?Haven, cId: string, request: SetHavenInfoRequest) => {
        if (h?.id != null) {
            const hId = h.id;

            const [title, message, action] =
                isNullOrEmpty(cId)
                    ? [
                        "Riassegnazione Dominio",
                        "Sei sicuro di voler togliere il Dominio dal personaggio?",
                        () => DeleteHavenCharacterMutation(environment, {
                            havenId: hId
                        })
                    ]
                    : [
                        "Assegnazione Dominio",
                        "Sei sicuro di voler assegnare questa locazione al personaggio selezionato?",
                        () => SetHavenCharacterMutation(environment, {
                            characterId: cId,
                            havenId: hId
                        })
                    ];

            showDialog(title, message,
                () => {
                    handleMutation(
                        () => action()
                            .then(_ => SetHavenInfoMutation(environment, hId, request))
                            .finally(_ => setFetchKey(p => p + 1)),
                        enqueueSnackbar,
                        {
                            successMessage: "La modifica è stata effettuata con successo."
                        });
                });
        }
    };
    
    const onMarkResonance = (h: ?Haven, {resonance, power}: SetResonanceZoneRequest) => {
        if (h?.id != null && resonance != null) {
            const hId = h.id;

            showDialog("Assegnazione Risonanza", `Sei sicuro di voler marcare questa zona con una risonanza ${resonance}?`,
                () => {
                    handleMutation(
                        () => SetResonanceZoneMutation(environment, hId, {
                            resonance: resonance,
                            power: power ?? 3
                        })
                            .finally(_ => setFetchKey(p => p + 1)),
                        enqueueSnackbar,
                        {
                            successMessage: "La modifica è stata effettuata con successo."
                        });
                });
        }
    };

    const onResetResonances = (_: any) => {
        showDialog("Resetta Risonanze", `Sei sicuro di voler resettare tutte le risonanze nel Dominio? Questo cancellerà completamente lo stato attuale.`,
            () => {
                handleMutation(
                    () => ResetResonancesMutation(environment)
                        .finally(_ => setFetchKey(p => p + 1)),
                    enqueueSnackbar,
                    {
                        successMessage: "La modifica è stata effettuata con successo."
                    });
            });
    };

    const onResetDanger = (_: any) => {
        showDialog("Resetta Pericolosità", `Sei sicuro di voler resettare tutte le pericolosità nel Dominio? Questo cancellerà completamente lo stato attuale.`,
            () => {
                handleMutation(
                    () => ResetDangerMutation(environment)
                        .finally(_ => setFetchKey(p => p + 1)),
                    enqueueSnackbar,
                    {
                        successMessage: "La modifica è stata effettuata con successo."
                    });
            });
    };

    const onSetDanger = (h: ?Haven, {danger, range}: SetDangerZoneRequest) => {
        if (h?.id != null) {
            const hId = h.id;

            showDialog("Assegnazione Pericolo", `Sei sicuro di voler cambiare il pericolo di questa zona?`,
                () => {
                    handleMutation(
                        () => SetDangerZoneMutation(environment, hId, {
                            danger,
                            range
                        })
                            .finally(_ => setFetchKey(p => p + 1)),
                        enqueueSnackbar,
                        {
                            successMessage: "La modifica è stata effettuata con successo."
                        });
                });
        }
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                <h1 >
                    Gestione rifugio
                </h1>
            </Grid>
            <Grid item xs={6}>
                <Box sx={{
                    width: "100%",
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <Button variant="outlined" onClick={onResetResonances}>
                        Resetta Risonanze
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box sx={{
                    width: "100%",
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <Button variant="outlined" onClick={onResetDanger}>
                        Resetta Pericolosit&agrave;
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <AdminHavensModal haven={haven}
                                  open={open}
                                  handleClose={_ => setOpen(_ => false)}
                                  onSelected={onCharacterSubmitted}
                                  onMarkResonance={onMarkResonance}
                                  onSetDanger={onSetDanger}
                                  havenCharacterId={haven?.character?.id} />
                <HavenMap onSectionSelected={onHavenSelected}
                          fetchKey={fetchKey} />
            </Grid>
        </Grid>
    );
};

export default AdminHavens;
