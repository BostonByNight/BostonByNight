// @flow

import React, {useState} from "react";
import type {Character} from "../../../../services/queries/character/GetCharacterCompleteQuery";
import Grid from "@mui/material/Grid";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {baseMenuItems, emptyExactObject, handleMutation,} from "../../../../_base/utils";
import Button from "@mui/material/Button";
import {useRelayEnvironment} from "react-relay";
import ChangeCharacterOtherStatsMutation from "../../../../services/mutations/admin/ChangeCharacterOtherStatsMutation";
import {useCustomLazyLoadQuery} from "../../../../_base/relay-utils";
import {predatorTypesQuery} from "../../../../services/queries/info/PredatorTypesQuery";
import type {GenericEvent, GenericReactComponent} from "../../../../_base/types";
import {useDialog} from "../../../../_base/providers/DialogProvider";
import {useCustomSnackbar} from "../../../../_base/notification-utils";

type Props = {
    character: Character;
    onUpdate: () => void;
}

const ChangeCharacterOtherStatsForm = ({character, onUpdate}: Props): GenericReactComponent => {
    const {showDialog} = useDialog()
    const {enqueueSnackbar} = useCustomSnackbar();
    const environment = useRelayEnvironment();
    const predatorTypes = useCustomLazyLoadQuery(predatorTypesQuery, emptyExactObject())
        ?.predatorTypes;

    const [willpower, setWillpower] = useState(character?.willpower ?? 0);
    const [health, setHealth] = useState(character?.health ?? 0);
    const [humanity, setHumanity] = useState(character?.humanity ?? 0);
    const [bloodPotency, setBloodPotency] = useState(character?.bloodPotency ?? 0);
    const [predatorType, setPredatorType] = useState(character?.predatorType?.id ?? "");

    const changeCharacterOtherStats = (_: any) => {
        showDialog(
            `Cambio di status per ${character.name ?? ""}`,
            `Sei sicuro di voler cambiare le caratteristiche di questo personaggio?`,
            () => {
                handleMutation(() => ChangeCharacterOtherStatsMutation(environment, {
                    characterId: character.id,
                    humanity: humanity,
                    willpower: willpower,
                    predatorTypeId: predatorType,
                    health: health,
                    bloodPotency: bloodPotency
                }), enqueueSnackbar, {
                    successMessage: "Il personaggio è stato modificato correttamente. Per visualizzare le nuove modifiche, è necessario aggiornare la pagina (F5)",
                    errorMessage: "C'è stato un errore durante la modifica del personaggio, contatta l'admin per maggiori informazioni.",
                    onCompleted: onUpdate
                });
            }
        );
    };

    const menuItems = () => baseMenuItems(1, 10);

    const predatorTypeItems = () =>
        predatorTypes?.map(t => <MenuItem key={t?.id} value={t?.id}>{t?.name}</MenuItem>);

    const onHumanityChanged = ({target: {value}}: GenericEvent) => {
        setHumanity(_ => value);
    };

    const onWillpowerChanged = ({target: {value}}: GenericEvent) => {
        setWillpower(_ => value);
    };

    const onPredatorTypeChanged = ({target: {value}}: GenericEvent) => {
        setPredatorType(_ => value);
    };

    const onHealthChanged = ({target: {value}}: GenericEvent) => {
        setHealth(_ => value);
    };

    const onBloodPotencyChanged = ({target: {value}}: GenericEvent) => {
        setBloodPotency(_ => value);
    };

    const containerStyle = {
        textAlign: "center",
        padding: "10px"
    };

    return (
        <Grid item xs={12} sx={{margin: "20px"}}>
            <Grid container>
                <Grid item xs={12} md={3} sx={containerStyle}>
                    <FormControl sx={{width: "150px"}}>
                        <InputLabel id="humanity-label">Umanità</InputLabel>
                        <Select labelId="humanity-label"
                                id="humanity"
                                value={humanity}
                                label="Umanità"
                                onChange={onHumanityChanged}>
                            {menuItems()}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3} sx={containerStyle}>
                    <FormControl sx={{width: "150px"}}>
                        <InputLabel id="willpower-label">Forza di Volontà</InputLabel>
                        <Select labelId="willpower-label"
                                id="willpower"
                                value={willpower}
                                label="Forza di Volontà"
                                onChange={onWillpowerChanged}>
                                {menuItems()}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3} sx={containerStyle}>
                    <FormControl sx={{width: "150px"}}>
                        <InputLabel id="predator-type-label">Predatore</InputLabel>
                        <Select labelId="predator-type-label"
                                id="predator-type"
                                value={predatorType}
                                label="Predatore"
                                onChange={onPredatorTypeChanged}>
                            {predatorTypeItems()}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={3} sx={containerStyle}>
                    <Button variant="outlined"
                            onClick={changeCharacterOtherStats}>Aggiorna</Button>
                </Grid>
                <Grid item xs={12} md={3} sx={containerStyle}>
                    <FormControl sx={{width: "150px"}}>
                        <InputLabel id="health-label">Salute</InputLabel>
                        <Select labelId="health-label"
                                id="health"
                                value={health}
                                label="Salute"
                                onChange={onHealthChanged}>
                            {menuItems()}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3} sx={containerStyle}>
                    <FormControl sx={{width: "150px"}}>
                        <InputLabel id="blood-potency-label">Potenza del Sangue</InputLabel>
                        <Select labelId="blood-potency-label"
                            id="blood-potency"
                            value={bloodPotency}
                            label="Potenza del Sangue"
                            onChange={onBloodPotencyChanged}>
                            {baseMenuItems(0, 4)}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ChangeCharacterOtherStatsForm;
