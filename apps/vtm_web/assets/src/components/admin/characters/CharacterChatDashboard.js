// @flow

import React from "react";
import CharacterSheet from "../../character/CharacterSheet";
import Grid from "@mui/material/Grid";
import ChangeCharacterStatusForm from "./forms/ChangeCharacterStatusForm";
import {useCharacterCompleteQuery} from "../../../services/queries/character/GetCharacterCompleteQuery";

type Props = {
    characterId: string;
}

const CharacterChatDashboard = ({characterId}: Props): any => {
    const character = useCharacterCompleteQuery(characterId);

    const showCharacterStatusForm = () => {
        if (character != null) {
            return (<ChangeCharacterStatusForm character={character} />);
        }

        return (<></>);
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                {showCharacterStatusForm()}
            </Grid>
            <Grid item xs={12}>
                <CharacterSheet contained={true}
                                id={characterId}
                                reload={true}/>
            </Grid>
        </Grid>
    );
}

export default CharacterChatDashboard;
