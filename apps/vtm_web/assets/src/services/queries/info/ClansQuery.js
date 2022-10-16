// @flow

import graphql from 'babel-plugin-relay/macro'
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {ClansQuery$data, ClansQuery$variables,} from "./__generated__/ClansQuery.graphql";

export const clansQuery: Query<ClansQuery$variables, ClansQuery$data> = graphql`
    query ClansQuery {
        clans {
            id
            name
        }
    }
`;
