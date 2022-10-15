// @flow

import graphql from 'babel-plugin-relay/macro';
import type {GetUserVisibleQueryVariables, GetUserVisibleQueryResponse} from "./__generated__/GetUserVisibleQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export const getUserVisibleQuery: Query<GetUserVisibleQueryVariables, GetUserVisibleQueryResponse> = graphql`
    query GetUserVisibleQuery {
        userOnlineVisible
    }
`;
