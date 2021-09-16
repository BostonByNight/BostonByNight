// @flow

import React from "react";
import type {Character} from "../../services/queries/character/GetCharacterCompleteQuery";
import type {CharacterProviderBaseProps} from "./character-providers-types";
import {useCharacterProviderId} from "./character-providers-types";
import RemoteCharacterProvider from "./RemoteCharacterProvider";
import {useCharacterCompleteQuery} from "../../services/queries/character/GetCharacterCompleteQuery";

type Props = CharacterProviderBaseProps & {
    children: ?Character => any,
}

const CharacterProviderQuery = ({characterId, children}) => {
    const character = useCharacterCompleteQuery(characterId);

    if (character?.getCharacter?.id != null) {
        return children(character);
    }

    return <></>;
}

const CharacterProvider = (props: Props): any => {
    const characterId = useCharacterProviderId(props.characterId);

    if (characterId != null) {
        return (
            <CharacterProviderQuery characterId={characterId}>
                {props.children}
            </CharacterProviderQuery>
        );
    }

    return (
        <RemoteCharacterProvider>
            { characterId =>
                <CharacterProviderQuery characterId={characterId} children={props.children} />
            }
        </RemoteCharacterProvider>
    );
}

export default CharacterProvider;