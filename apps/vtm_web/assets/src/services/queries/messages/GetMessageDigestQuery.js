// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    GetMessageDigestQuery$data,
    GetMessageDigestQuery$variables,
} from "./__generated__/GetMessageDigestQuery.graphql";

export const getMessageDigestQuery: Query<GetMessageDigestQuery$variables, GetMessageDigestQuery$data> = graphql`
    query GetMessageDigestQuery {
        messagesDigest {
            totalMessages
            unreadMessages
        }
    }
`;
