// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    UserSentMessagesQuery$data,
    UserSentMessagesQuery$variables,
} from "./__generated__/UserSentMessagesQuery.graphql";

export const userSentMessagesQuery: Query<UserSentMessagesQuery$variables, UserSentMessagesQuery$data> = graphql`
    query UserSentMessagesQuery {
        me {
            sentMessages {
                id
                subject
                receiverUser {
                    id
                    name
                }
                receiverCharacter {
                    id
                    name
                }
                receiverUserId
                receiverCharacterId
                read
                onGame
                insertedAt
                modifiedAt
            }
        }
    }
`;
