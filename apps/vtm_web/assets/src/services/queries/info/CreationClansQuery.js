// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    CreationClansQuery$data,
    CreationClansQuery$variables,
} from "./__generated__/CreationClansQuery.graphql";

export const creationClansQuery: Query<CreationClansQuery$variables, CreationClansQuery$data> = graphql`
    query CreationClansQuery {
        creationClans {
            id
            name
        }
    }
`;
