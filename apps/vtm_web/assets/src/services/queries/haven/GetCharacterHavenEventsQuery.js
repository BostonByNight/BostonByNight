// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    GetCharacterHavenEventsQuery$data,
    GetCharacterHavenEventsQuery$variables,
} from "./__generated__/GetCharacterHavenEventsQuery.graphql";

export const getCharacterHavenEventsQuery: Query<GetCharacterHavenEventsQuery$variables, GetCharacterHavenEventsQuery$data> = graphql`
    query GetCharacterHavenEventsQuery($characterId: ID!) {
        getCharacterDomainEvents(input: {characterId: $characterId}) {
            result {
                ...HavenEventFragment_fragment @relay(mask: false)
            }
        }
    }
`;
