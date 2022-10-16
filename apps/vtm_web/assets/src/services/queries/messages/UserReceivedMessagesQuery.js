// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    UserReceivedMessagesQuery$data,
    UserReceivedMessagesQuery$variables,
} from "./__generated__/UserReceivedMessagesQuery.graphql";

export const userReceivedMessagesQuery: Query<UserReceivedMessagesQuery$variables, UserReceivedMessagesQuery$data> = graphql`
    query UserReceivedMessagesQuery {
        me {
            receivedMessages {
                id
                subject
                senderUser {
                    id
                    name
                }
                senderCharacter {
                    id
                    name
                }
                senderUserId
                senderCharacterId
                read
                onGame
                insertedAt
                modifiedAt
            }
        }
    }
`;
