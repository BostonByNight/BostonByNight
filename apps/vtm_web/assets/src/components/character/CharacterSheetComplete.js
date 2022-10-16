// @flow

import React, {Suspense} from "react";
import CharacterFragmentProvider from "../_data/CharacterFragmentProvider";
import ResponsiveInnerContainer from "../../_base/components/ResponsiveInnerContainer";
import Paper from "@mui/material/Paper";
import {CharacterSheetSuspenseFallback} from "./CharacterSheet";
import {useHistory} from "react-router-dom";
import {useUserCharactersQuery} from "../../services/queries/accounts/UserCharactersQuery";
import Button from "@mui/material/Button";
import {MainRoutes} from "../MainRouter";
import CharacterSheetTabs from "./sheet-sections/tabs/CharacterSheetTabs";
import type {GenericReactComponent} from "../../_base/types";
import {useRecoilValue} from "recoil";
import {sessionStateAtom} from "../../session/atoms";
import type {Character} from "../../services/queries/character/GetCharacterCompleteQuery";

type Props = {
    id?: string;
    reload?: boolean;
    contained?: boolean;
    fetchKey?: number;
}

const CharacterSheetComplete = (props: Props): GenericReactComponent => {
    const history = useHistory();
    const userCharacters = useUserCharactersQuery();
    const user = useRecoilValue(sessionStateAtom)

    const canModify = (character: Character) => user?.role === "MASTER" || userCharacters.some(c => c.id === character?.id);

    const modifySheetLink = (character: Character) => {
        if (!(props.contained === true) && canModify(character) && character?.id != null) {
            return (
                <div style={{
                    margin: "20px",
                    textAlign: "center"
                }}>
                    <Button variant="outlined" onClick={_ => history.push(MainRoutes.modifySheet(character.id))}>
                        Modifica scheda
                    </Button>
                </div>
            );
        }

        return (<></>);
    };

    return (
        <CharacterFragmentProvider characterId={props.id}
                                   showWarningWhenNoCharacterSelected={true}
                                   reload={props.reload}
                                   fetchKey={props.fetchKey}>
            { character =>
                <ResponsiveInnerContainer>
                    <Paper variant="outlined" sx={{backgroundColor: "background.paper"}}>
                        <Suspense fallback={<CharacterSheetSuspenseFallback />}>
                            {modifySheetLink(character)}
                            <CharacterSheetTabs characterQuery={character} />
                        </Suspense>
                    </Paper>
                </ResponsiveInnerContainer>
            }
        </CharacterFragmentProvider>
    );
}

export default CharacterSheetComplete;
