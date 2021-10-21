// @flow

import React, {useState} from "react";
import MainLayout from "../../MainLayout";
import {useCharacterCompleteQuery} from "../../../services/queries/character/GetCharacterCompleteQuery";
import CharacterSheet from "../../sheet/CharacterSheet";
import Grid from "@mui/material/Grid";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ApproveCharacterForm from "../approvation/ApproveCharacterForm";
import ChangeCharacterAttributeForm from "./forms/ChangeCharacterAttributeForm";
import ChangeCharacterOtherStatsForm from "./forms/ChangeCharacterOtherStatsForm";
import Paper from "@mui/material/Paper";
import ChangeCharacterNotesForm from "./forms/ChangeCharacterNotesForm";
import AddCharacterExperienceForm from "./forms/AddCharacterExperienceForm";
import ChangeCharacterStatusForm from "./forms/ChangeCharacterStatusForm";
import ResetHuntForm from "./forms/ResetHuntForm";

type Props = {
    characterId: string;
}

const CharacterDashboard = ({characterId}: Props): any => {
    const character = useCharacterCompleteQuery(characterId);

    const [showSheet, setShowSheet] = useState(true);

    const changeSheetVisible = ({target: {checked}}) => {
        setShowSheet(_ => checked);
    };

    const sheet = () => {
        if (showSheet) {
            return (
                <Grid item xs={12} sx={{
                    margin: "5px"
                }}>
                    <Paper elevation={12}>
                        <CharacterSheet id={character?.id}
                                        reload={true}
                                        contained={true}/>
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
                        <Paper elevation={12} variant="outlined" sx={{margin: "10px"}}>
                            <ChangeCharacterAttributeForm character={character} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper elevation={12} variant="outlined" sx={{margin: "10px"}}>
                            <ChangeCharacterOtherStatsForm character={character} />
                        </Paper>
                    </Grid>
                    <Grid xs={12}>
                        <Paper elevation={12} variant="outlined" sx={{margin: "10px"}}>
                            <ChangeCharacterStatusForm character={character} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper elevation={12} variant="outlined" sx={{margin: "10px"}}>
                            <ChangeCharacterNotesForm character={character} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper elevation={12} variant="outlined" sx={{margin: "10px"}}>
                            <AddCharacterExperienceForm character={character} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper elevation={12} variant="outlined" sx={{margin: "10px"}}>
                            <ApproveCharacterForm character={character} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper elevation={12} variant="outlined" sx={{margin: "10px"}}>
                            <ResetHuntForm character={character} />
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

    return (
        <MainLayout>
            {showDashboard()}
        </MainLayout>
    );
}

export default CharacterDashboard;