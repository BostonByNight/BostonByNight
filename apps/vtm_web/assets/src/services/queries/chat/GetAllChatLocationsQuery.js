// @flow

import type {
    GetAllChatLocationsQuery$data,
    GetAllChatLocationsQuery$variables,
} from "./__generated__/GetAllChatLocationsQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

import graphql from 'babel-plugin-relay/macro';

export const getAllChatLocationsQuery: Query<GetAllChatLocationsQuery$variables, GetAllChatLocationsQuery$data> = graphql`
    query GetAllChatLocationsQuery {
        allChatLocations {
            id
            name
        }
    }
`;
