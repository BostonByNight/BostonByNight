// @flow

import React from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import {useRelayEnvironment} from "react-relay";
import {useDialog} from "../../../../_base/providers/DialogProvider";
import {useCustomSnackbar} from "../../../../_base/notification-utils";

import type {GenericReactComponent} from "../../../../_base/types";
import type {Character} from "../../../../services/queries/character/GetCharacterCompleteQuery";
import {useCustomLazyLoadQuery} from "../../../../_base/relay-utils";
import {GetAllOccupationsQuery} from "../../../../services/queries/occupations/GetAllOccupationsQuery";
import {handleMutation, isNotNullNorEmpty, range, rangeArray, toNotNullArray} from "../../../../_base/utils";
import {GetCharacterOccupationQuery} from "../../../../services/queries/occupations/GetCharacterOccupationQuery";
import {GetOccupationByIdQuery} from "../../../../services/queries/occupations/GetOccupationByIdQuery";
import MenuItem from "@mui/material/MenuItem";
import ChangeCharacterOccupationMutation from "../../../../services/mutations/admin/ChangeCharacterOccupationMutation";

type Props = {
    character: Character;
    onUpdate: () => void;
}

type LevelSelectionProps = {
    characterLevel: ?number;
    occupationId: string;
    onLevelSelected: number => void;
}

const LevelSelectionForm = ({occupationId, characterLevel, onLevelSelected}: LevelSelectionProps) => {
    const occupation = useCustomLazyLoadQuery(GetOccupationByIdQuery, {id: occupationId})?.getOccupation

    const isLevelNecessary = () => isNotNullNorEmpty(occupation?.level2Name)

    const getLevelInfo = (level: number): [string, number] =>
        // TODO - Find a more intelligent way to express the array from properties
        // $FlowFixMe
        [occupation[`level${level}Name`], occupation[`level${level}Salary`]]

    const getLevelDescriptions = () => rangeArray(1, 6).map(getLevelInfo)

    const possibleLevelsOptions = () => {
        const options = [];
        const info = getLevelDescriptions()

        for (let i of range(1, 6)) {
            const [name, salary] = info[i - 1]
            const selected = characterLevel === i
            options.push(<MenuItem key={i} value={i} selected={selected}>{i} - {name} (Compenso: {salary})</MenuItem>);
        }

        return options;
    };

    const onLevelChanged = ({target: {value}}: any) => {
        onLevelSelected(value);
    };

    if (isLevelNecessary()) {
        return (
            <Grid item xs={12} sm={4} sx={{textAlign: "center"}}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel htmlFor="level">Livello</InputLabel>
                    <Select defaultValue="1"
                            id="level"
                            label="Livello"
                            onChange={onLevelChanged}>
                        {possibleLevelsOptions()}
                    </Select>
                </FormControl>
            </Grid>
        );
    }

    return (<></>)
}

const ChangeCharacterOccupationForm = ({character, onUpdate}: Props): GenericReactComponent => {
    const environment = useRelayEnvironment()
    const {showDialog} = useDialog()
    const {enqueueSnackbar} = useCustomSnackbar()

    const characterOccupation = useCustomLazyLoadQuery(GetCharacterOccupationQuery, {characterId: character?.id})
        ?.getCharacterOccupation

    const occupations = toNotNullArray(useCustomLazyLoadQuery(GetAllOccupationsQuery, {})?.getOccupations)

    const [selectedOccupationId, setSelectedOccupationId] = React.useState(characterOccupation?.occupation?.id ?? "")
    const [level, setLevel] = React.useState(characterOccupation?.level ?? 1)

    const onOccupationChanged = ({target: {value}}: any) => {
        setSelectedOccupationId(_ => value)
    }

    const onLevelChanged = (value: number) => {
        setLevel(_ => value)
    }

    const showOccupationOptions = () => occupations
        .map(({id, name}) => <MenuItem key={id} value={id}>{name}</MenuItem>)

    const changeCharacterOccupation = () => {
        showDialog(
            `Cambio di occupazione per ${character.name ?? ""}`,
            `Sei sicuro di voler cambiare l'occupazione di ${character.name ?? ""}?`,
            () => {
                const promise = ChangeCharacterOccupationMutation(environment, {
                    characterId: character?.id,
                    occupationId: selectedOccupationId,
                    level: level
                });

                handleMutation(() => promise, enqueueSnackbar, {
                    successMessage: "Il personaggio è stato modificato correttamente. Per visualizzare le nuove modifiche, è necessario aggiornare la pagina (F5)",
                    errorMessage: "C'è stato un errore durante la modifica del personaggio, contatta l'admin per maggiori informazioni.",
                    onCompleted: onUpdate
                });
            }
        );
    }

    return (
        <Grid item xs={12}>
            <Grid container>
                <Grid item xs={12} sm={4} sx={{textAlign: "center"}}>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel htmlFor="occupation">Maschera/Corporazione</InputLabel>
                        <Select defaultValue="1"
                                id="occupation"
                                label="Maschera/Corporazione"
                                onChange={onOccupationChanged}>
                            {showOccupationOptions()}
                        </Select>
                    </FormControl>
                </Grid>
                <LevelSelectionForm characterLevel={characterOccupation?.level}
                                    occupationId={selectedOccupationId}
                                    onLevelSelected={onLevelChanged} />
                <Grid item xs={12} sm={4} sx={{paddingTop: "20px", textAlign: "center"}}>
                    <Button variant="outlined"
                            onClick={changeCharacterOccupation}>
                        Assegna occupazione
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default ChangeCharacterOccupationForm;
