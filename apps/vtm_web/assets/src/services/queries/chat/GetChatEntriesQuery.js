// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    GetChatEntriesQuery$data,
    GetChatEntriesQuery$variables,
} from "./__generated__/GetChatEntriesQuery.graphql";

export const chatEntriesQuery: Query<GetChatEntriesQuery$variables, GetChatEntriesQuery$data> = graphql`
    query GetChatEntriesQuery($mapId: ID!) {
        mapChatEntries(mapId: $mapId) {
            id
            character {
                id
                name
            }
            chatMap {
                id
            }
            master
            result
            text
            offGame
            command
            hide
            insertedAt
        }
    }
`;
