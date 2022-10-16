// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {SessionQuery$data, SessionQuery$variables,} from "./__generated__/SessionQuery.graphql";

export const listSessionQuery: Query<SessionQuery$variables, SessionQuery$data> = graphql`
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
