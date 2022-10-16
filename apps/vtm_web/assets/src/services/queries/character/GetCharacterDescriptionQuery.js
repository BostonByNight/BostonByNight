// @flow

import graphql from 'babel-plugin-relay/macro';
import type {
    GetCharacterDescriptionQuery$data,
    GetCharacterDescriptionQuery$variables,
} from "./__generated__/GetCharacterDescriptionQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export const getCharacterDescriptionQuery: Query<GetCharacterDescriptionQuery$variables, GetCharacterDescriptionQuery$data> = graphql`
    query GetCharacterDescriptionQuery($id: ID!) {
        getCharacterDescription(characterId: $id) {
            id
            name
            avatar
            description
        }
    }
`;
