// @flow

import type {
    GetAvailableCharactersQuery$data,
    GetAvailableCharactersQuery$variables,
} from "./__generated__/GetAvailableCharactersQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

import graphql from 'babel-plugin-relay/macro';

export const getAvailableCharactersQuery: Query<GetAvailableCharactersQuery$variables, GetAvailableCharactersQuery$data> = graphql`
    query GetAvailableCharactersQuery {
        privateChatAvailableUsers {
            id
            name
        }
    }
`;
