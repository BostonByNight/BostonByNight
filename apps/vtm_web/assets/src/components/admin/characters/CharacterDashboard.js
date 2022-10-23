// @flow

import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {useCharacterCompleteQuery} from "../../../services/queries/character/GetCharacterCompleteQuery";
import CharacterSheet from "../../character/CharacterSheet";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ApproveCharacterForm from "../approvation/ApproveCharacterForm";
import ChangeCharacterAttributeForm from "./forms/ChangeCharacterAttributeForm";
import ChangeCharacterOtherStatsForm from "./forms/ChangeCharacterOtherStatsForm";
import ChangeCharacterNotesForm from "./forms/ChangeCharacterNotesForm";
import AddCharacterExperienceForm from "./forms/AddCharacterExperienceForm";
import ChangeCharacterStatusForm from "./forms/ChangeCharacterStatusForm";
import ResetHuntForm from "./forms/ResetHuntForm";
import SpendCharacterExperienceForm from "./forms/SpendCharacterExperienceForm";
import SendMessageToUserOrCharacter from "./forms/SendMessageToUserOrCharacter";
import SetHuntDifficultyForm from "./forms/SetHuntDifficultyForm";
import ChangeCharacterMoneyForm from "./forms/ChangeCharacterMoneyForm";
import type {GenericEvent, GenericReactComponent} from "../../../_base/types";
import ResetOccupationSalaryCheckForm from "./forms/ResetOccupationSalaryCheckForm";
import ChangeCharacterOccupationForm from "./forms/ChangeCharacterOccupationForm";

type Props = {
    characterId: string;
}

const CharacterDashboard = ({characterId}: Props): GenericReactComponent => {
    const character = useCharacterCompleteQuery(characterId);

    const [showSheet, setShowSheet] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);

    const changeSheetVisible = ({target: {checked}}: GenericEvent) => {
        setShowSheet(_ => checked);
    };

    const onUpdate = () => {
        setReloadCount(p => p + 1);
    }

    const sheet = () => {
        if (showSheet) {
            return (
                <Grid item xs={12} sx={{
                    margin: "5px"
                }}>
                    <Paper elevation={12}>
                        <CharacterSheet id={character?.id}
                                        reload={true}
                                        contained={true}
                                        fetchKey={reloadCount} />
                    </Paper>
                </Grid>
            );
        }

        return (<></>);
    }

    const showDashboard = () => {
        if (character != null) {
            return (
                <Grid container>
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{margin: "10px"}}>
                            <ChangeCharacterAttributeForm character={character}
                                                          onUpdate={onUpdate} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{margin: "10px"}}>
                            <ChangeCharacterOtherStatsForm character={character}
                                                           onUpdate={onUpdate} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{margin: "10px"}}>
                            <ChangeCharacterStatusForm character={character}
                                                       onUpdate={onUpdate} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{margin: "10px"}}>
                            <ChangeCharacterNotesForm character={character}
                                                      onUpdate={onUpdate} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{margin: "10px"}}>
                            <ChangeCharacterMoneyForm character={character}
                                                      onUpdate={onUpdate} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{margin: "10px"}}>
                            <SetHuntDifficultyForm character={character}
                                                   onUpdate={onUpdate} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{margin: "10px"}}>
                            <AddCharacterExperienceForm character={character}
                                                        onUpdate={onUpdate} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{margin: "10px"}}>
                            <SpendCharacterExperienceForm character={character}
                                                          onUpdate={onUpdate} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{margin: "10px"}}>
                            <ResetHuntForm character={character}
                                           onUpdate={onUpdate} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{margin: "10px"}}>
                            <ResetOccupationSalaryCheckForm character={character}
                                                            onUpdate={onUpdate} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{margin: "10px"}}>
                            <ChangeCharacterOccupationForm character={character}
                                                           onUpdate={onUpdate} />
                        </Paper>
                    </Grid>
                    <ApproveCharacterForm character={character} />
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{margin: "10px"}}>
                            <SendMessageToUserOrCharacter character={character} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup>
                            <FormControlLabel control={<Switch defaultChecked onChange={changeSheetVisible} />}
                                            label="Mostra scheda" />
                        </FormGroup>
                    </Grid>
                    {sheet()}
                </Grid>
            );
        }

        return (<></>);
    }

    return showDashboard();
}

export default CharacterDashboard;
