// @flow

import React from "react";
import {useHistory} from "react-router-dom";
import MenuCharacterItem from "./MenuCharacterItem";
import {MainRoutes} from "../../../MainRouter";
import CreateNewCharacterMenuItem from "./CreateNewCharacterMenuItem";
import {useUserCharactersQuery} from "../../../../services/queries/accounts/UserCharactersQuery";
import {useMenuCharactersAvatar} from "./MenuCharactersAvatarHook";
import type {GenericReactComponent} from "../../../../_base/types";
import {useCharacterRecoilState} from "../../../../session/hooks";

type Props = {
    pushHistory: string => void;
    reloadCount: number;
    onUpdate: () => void;
}

const MenuCharacterSectionForUser = ({pushHistory, reloadCount, onUpdate}: Props): GenericReactComponent => {
    const history = useHistory();
    const characters = useUserCharactersQuery(reloadCount);
    const charactersWithAvatars = useMenuCharactersAvatar(characters);

    const [,setCurrentCharacter] = useCharacterRecoilState()
    
    const handleSheetSelection = (info: any) =>
        (_: any) => {
            setCurrentCharacter(info);

            if (!info.approved && !info.isComplete) {
                pushHistory(`${MainRoutes.creationBase}${info.stage + 1}`);
            }
            else {
                pushHistory(MainRoutes.sheet(info.id));
            }

            onUpdate();
        }

    const showCharacters = () => {
        if (charactersWithAvatars != null && charactersWithAvatars.length > 0) {
            return charactersWithAvatars
                .filter(o => o !== null)
                .map(o => {
                    return (
                        <MenuCharacterItem character={o} 
                                           key={o?.id}
                                           handleSheetSelection={handleSheetSelection} />
                    )
                });
        }

        // return <MenuItem key={"0"} onClick={_ => history.push(MainRoutes.creation1)}>Crea nuovo</MenuItem>;
        return <CreateNewCharacterMenuItem key={0} onClick={_ => history.push(MainRoutes.creation1)} />
    }

    return (
        <>
            {showCharacters()}
        </>
    );
};

export default MenuCharacterSectionForUser;
