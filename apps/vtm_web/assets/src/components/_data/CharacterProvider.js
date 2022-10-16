// @flow

import React from "react";
import type {Character} from "../../services/queries/character/GetCharacterCompleteQuery";
import {useCharacterCompleteQuery} from "../../services/queries/character/GetCharacterCompleteQuery";
import type {CharacterProviderBaseProps} from "./character-providers-types";
import {useCharacterProviderId} from "./character-providers-types";
import RemoteCharacterProvider from "./RemoteCharacterProvider";
import type {GenericReactComponent} from "../../_base/types";

type Props = CharacterProviderBaseProps & {
    showWarningWhenNoCharacterSelected: boolean,
    children: ?Character => any
}

type CharacterProviderQueryProps = {
    characterId: string;
    children: ?Character => any
}

const CharacterProviderQuery = ({characterId, children}: CharacterProviderQueryProps) => {
    const character = useCharacterCompleteQuery(characterId);

    if (character?.id != null) {
        return children(character);
    }

    return <></>;
}

const CharacterProvider = (props: Props): GenericReactComponent => {
    const characterId = useCharacterProviderId(props.characterId);

    if (characterId != null) {
        return (
            <CharacterProviderQuery characterId={characterId}>
                {props.children}
            </CharacterProviderQuery>
        );
    }

    return (
        <RemoteCharacterProvider showWarningWhenNoCharacterSelected={props.showWarningWhenNoCharacterSelected}>
            { characterId =>
                <CharacterProviderQuery characterId={characterId} children={props.children} />
            }
        </RemoteCharacterProvider>
    );
}

export default CharacterProvider;
