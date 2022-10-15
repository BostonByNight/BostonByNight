// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {SessionQueryResponse, SessionQueryVariables,} from "./__generated__/SessionQuery.graphql";

export const listSessionQuery: Query<SessionQueryVariables, SessionQueryResponse> = graphql`
    query SessionQuery {
        sessionsList {
            user {
                id
                name
                role
            }
            character {
                id
                name
            }
            location {
                id
                name
            }
            visible
        }
    }
`;
