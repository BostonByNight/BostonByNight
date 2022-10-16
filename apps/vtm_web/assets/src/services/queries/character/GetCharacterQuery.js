// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {GetCharacterQuery$data, GetCharacterQuery$variables,} from "./__generated__/GetCharacterQuery.graphql";

export const getCharacterQuery: Query<GetCharacterQuery$variables, GetCharacterQuery$data> = graphql`
    query GetCharacterQuery($id: ID!) {
        getCharacter(id: $id) {
            id,
            ...CharacterFragments_characterInfo
            ...CharacterFragments_characterConcealedInfo
            ...CharacterFragments_characterSheet
            ...CharacterFragments_characterStats
            ...CharacterFragments_characterState
            ...CharacterFragments_characterOff
        }
    }
`;
