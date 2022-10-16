// @flow

import React, {useState} from "react";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import SendMessageToCharacter from "../_layout/button-links/SendMessageToCharacter";
import Stack from "@mui/material/Stack";
import ShowCharacterSheet from "../_layout/button-links/ShowCharacterSheet";
import ShowCharacterDashboard from "../_layout/button-links/ShowCharacterDashboard";
import List from "@mui/material/List";
import {useTheme} from "@mui/material/styles";
import {useMediaQuery} from "@mui/material";
import MenuLayout from "../../_base/components/MenuLayout";
import { matchNames, readonlyFilterNulls } from "../../_base/utils";
import type {GenericEvent, GenericReactComponent} from "../../_base/types";
import type {AllCharactersQuery$data} from "../../services/queries/character/__generated__/AllCharactersQuery.graphql";
import type {AllUnapprovedCharactersQuery$data} from "../../services/queries/character/__generated__/AllUnapprovedCharactersQuery.graphql";

type Props = {
    characters: AllCharactersQuery$data['charactersList'] |
        AllUnapprovedCharactersQuery$data['unapprovedCharactersList'];
};

const ShowCharactersComponent = ({characters}: Props): GenericReactComponent => {
    // $FlowFixMe
    const notNullCharacters = readonlyFilterNulls(characters)
    const [filteredCharacter, setFilteredCharacter] = useState(notNullCharacters)

    const primaryTextProps = (approved: ?boolean, isComplete: ?boolean) => {
        if (isComplete !== true || approved !== true) {
            return {
                color: "secondary.light"
            }
        }

        return {};
    }

    const characterLine = ({id, name, approved, isComplete}: {
        id: string,
        name: ?string,
        approved: boolean,
        isComplete: boolean
    }
    ) => {
        return (
            <Box component="div" key={id}>
                <Divider />
                <ListItem key={id}
                          secondaryAction={<CharacterActions characterId={id} />}>
                    <ListItemText primary={name}
                                  primaryTypographyProps={primaryTextProps(approved, isComplete)} />
                </ListItem>
            </Box>
        );
    }

    const showCharacters = () =>
        filteredCharacter.map(characterLine);

    const filter = ({target: {value}}: GenericEvent) => {
        const filtered = notNullCharacters.filter(c => matchNames(c.name, value));
        setFilteredCharacter(_ => filtered);
    };

    return (
        <Box sx={{
            margin: "0 auto",
            maxWidth: "550px",
            bgcolor: 'background.paper'
        }}>
            <Grid container>
                <Grid item xs={12} sx={{
                    textAlign: "center",
                    padding: "20px"
                }}>
                    <TextField onKeyUp={filter}
                               variant="outlined"
                               label="Filtra" />
                </Grid>
                <Grid item xs={12}>
                    <List sx={{width: "100%"}}>
                        {showCharacters()}
                    </List>
                </Grid>
            </Grid>
        </Box>
    );
}

const CharacterActions = ({characterId}: {characterId: string}) => {
    const theme = useTheme();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

    if (isSmallScreen) {
        return (
            <MenuLayout>
                { onItemSelected =>
                    <>
                        <ShowCharacterSheet characterId={characterId}
                                            onSelected={onItemSelected}
                                            asMenuItem />
                        <SendMessageToCharacter characterId={characterId}
                                                onSelected={onItemSelected}
                                                asMenuItem />
                        <ShowCharacterDashboard characterId={characterId}
                                                onSelected={onItemSelected}
                                                asMenuItem />
                    </>
                }
            </MenuLayout>
        );
    }

    return (
        <Stack direction="row" spacing={0}>
            <SendMessageToCharacter characterId={characterId} />
            <ShowCharacterSheet characterId={characterId} />
            <ShowCharacterDashboard characterId={characterId} />
        </Stack>
    );
}

export default ShowCharactersComponent;
