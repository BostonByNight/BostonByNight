// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {AllPlayersQuery$data, AllPlayersQuery$variables} from "./__generated__/AllPlayersQuery.graphql";

export const allPlayersQuery: Query<AllPlayersQuery$variables, AllPlayersQuery$data> = graphql`
    query AllPlayersQuery {
        playersCharactersList {
            id
            name
            user {
                id
            }
        }
    }
`;
