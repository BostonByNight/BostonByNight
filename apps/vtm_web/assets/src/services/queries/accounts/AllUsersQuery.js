// @flow

import type {AllUsersQuery$data, AllUsersQuery$variables,} from "./__generated__/AllUsersQuery.graphql";

import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

import graphql from 'babel-plugin-relay/macro';

export const allUsersQuery: Query<AllUsersQuery$variables, AllUsersQuery$data> = graphql`
    query AllUsersQuery {
        allUsers {
            id
            name
        }
    }
`;
