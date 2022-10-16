// @flow

import React from "react";
import {useCharacterProviderId} from "./character-providers-types";
import RemoteCharacterProvider from "./RemoteCharacterProvider";
import {getCharacterQuery} from "../../services/queries/character/GetCharacterQuery";
import {useCustomLazyLoadQuery} from "../../_base/relay-utils";
import {randomFetchKey} from "../../_base/utils";
import type {GenericReactComponent} from "../../_base/types";

type Props = {
    characterId?: string;
    showWarningWhenNoCharacterSelected: boolean;
    children: any => any;
    reload?: boolean;
    fetchKey?: number;
};

type CharacterFragmentProviderQueryProps = {
    characterId: string;
    children: any => any;
    reload?: boolean;
    fetchKey?: number;
}

const CharacterFragmentProviderQuery = ({characterId, children, reload, fetchKey}: CharacterFragmentProviderQueryProps) => {
    const parsedFetchKey = fetchKey ?? (reload ? randomFetchKey() : 0);

    const policy = {
        fetchPolicy: reload ? "store-and-network" : "store-or-network",
        fetchKey: parsedFetchKey
    };

    const character =
        useCustomLazyLoadQuery(getCharacterQuery, { id: characterId }, policy)
            ?.getCharacter;

    if (character?.id != null) {
        return children(character);
    }

    return (
        <></>
    );
};

const CharacterFragmentProvider = (props: Props): GenericReactComponent => {
    const characterId = useCharacterProviderId(props.characterId);

    if (characterId != null) {
        return (
            <CharacterFragmentProviderQuery characterId={characterId}
                                            reload={props.reload}
                                            fetchKey={props.fetchKey}>
                {props.children}
            </CharacterFragmentProviderQuery>
        );
    }

    return (
        <RemoteCharacterProvider showWarningWhenNoCharacterSelected={props.showWarningWhenNoCharacterSelected ?? false}>
            { characterId =>
                <CharacterFragmentProviderQuery characterId={characterId}
                                                reload={props.reload}
                                                fetchKey={props.fetchKey}>
                    {props.children}
                </CharacterFragmentProviderQuery>
            }
        </RemoteCharacterProvider>
    );
}

export default CharacterFragmentProvider;
