// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    GetCharacterUserQuery$data,
    GetCharacterUserQuery$variables,
} from "./__generated__/GetCharacterUserQuery.graphql";

export const getCharacterUserQuery: Query<GetCharacterUserQuery$variables, GetCharacterUserQuery$data> = graphql`
    query GetCharacterUserQuery($characterId: ID!) {
        getCharacterUser(characterId: $characterId) {
            id
            name
            role
        }
    }
`;
