// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    GetHavenUnresolvedEventsQuery$data,
    GetHavenUnresolvedEventsQuery$variables,
} from "./__generated__/GetHavenUnresolvedEventsQuery.graphql";

export const getHavenUnresolvedEventsQuery: Query<GetHavenUnresolvedEventsQuery$variables, GetHavenUnresolvedEventsQuery$data> = graphql`
    query GetHavenUnresolvedEventsQuery {
        getUnresolvedEvents {
            result {
                ...HavenEventFragment_fragment @relay(mask: false)
            }
        }
    }
`;
