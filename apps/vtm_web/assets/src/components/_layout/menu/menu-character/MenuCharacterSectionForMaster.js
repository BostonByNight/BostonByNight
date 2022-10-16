// @flow

import React from "react";
import {useHistory} from "react-router-dom";
import MenuCharacterItem from "./MenuCharacterItem";
import type {UserCharacter} from "../../../../services/queries/accounts/UserCharactersQuery";
import {MainRoutes} from "../../../MainRouter";
import CreateNewCharacterMenuItem from "./CreateNewCharacterMenuItem";
import type {GenericReactComponent} from "../../../../_base/types";
import {useCharacterRecoilState} from "../../../../session/hooks";

type Props = {
    pushHistory: string => void;
    characters: Array<UserCharacter>;
    onUpdate: () => void;
}

const MenuCharacterSectionForMaster = ({pushHistory, characters, onUpdate}: Props): GenericReactComponent => {
    const history = useHistory()
    const [,setCurrentCharacter] = useCharacterRecoilState();
    
    const handleSheetSelection = (info: UserCharacter) =>
        (_: any) => {
            if (!info.approved && !info.isComplete) {
                pushHistory(`${MainRoutes.creationBase}${info.stage + 1}`);
            }
            else {
                pushHistory(MainRoutes.sheet(info.id));
            }
        };

    const handleCharacterSelection = (info: UserCharacter) =>
        (_: any) => {
            setCurrentCharacter({
                id: info.id,
                name: info.name,
                approved: info.approved,
                clan: {
                    name: info.clan?.name
                }
            });

            onUpdate();
        };

    const showCharacters = () => {
        if (characters != null && characters.length > 0) {
            return characters
                .filter(o => o !== null)
                .map(o => (<MenuCharacterItem character={o}
                                              key={o?.id}
                                              handleSheetSelection={handleSheetSelection}
                                              handleCharacterSelection={handleCharacterSelection} />));
        }

        // return <MenuItem key={"0"} onClick={_ => history.push(MainRoutes.creation1)}>Crea nuovo personaggio</MenuItem>;
        return <CreateNewCharacterMenuItem key={0} onClick={_ => history.push(MainRoutes.creation1)} />
    }

    return (
        <>
            {showCharacters()}
        </>
    );
}

export default MenuCharacterSectionForMaster;
