// @flow

import graphql from 'babel-plugin-relay/macro';
import type {GetUserVisibleQuery$variables, GetUserVisibleQuery$data} from "./__generated__/GetUserVisibleQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export const getUserVisibleQuery: Query<GetUserVisibleQuery$variables, GetUserVisibleQuery$data> = graphql`
    query GetUserVisibleQuery {
        userOnlineVisible
    }
`;
