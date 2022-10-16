// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    AllCharactersQuery$data,
    AllCharactersQuery$variables,
} from "./__generated__/AllCharactersQuery.graphql";

export const allCharactersQuery: Query<AllCharactersQuery$variables, AllCharactersQuery$data> = graphql`
    query AllCharactersQuery {
        charactersList {
            id
            name
            approved
            isComplete
            user {
                id
            }
        }
    }
`;
