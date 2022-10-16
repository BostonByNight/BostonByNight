// @flow

import type {
    GetAdminChatEntriesQuery$data,
    GetAdminChatEntriesQuery$variables,
} from "./__generated__/GetAdminChatEntriesQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

import graphql from 'babel-plugin-relay/macro';

export const getAdminChatEntriesQuery: Query<GetAdminChatEntriesQuery$variables, GetAdminChatEntriesQuery$data> = graphql`
    query GetAdminChatEntriesQuery($mapId: ID!, $fromDate: DateTime!, $toDate: DateTime!) {
        mapAdminChatEntries(mapId: $mapId, from: $fromDate, to: $toDate) {
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
            insertedAt
        }
    }
`;
