// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    GetCharacterChatAvatarQuery$data,
    GetCharacterChatAvatarQuery$variables,
} from "./__generated__/GetCharacterChatAvatarQuery.graphql";

export const getCharacterChatAvatarQuery: Query<GetCharacterChatAvatarQuery$variables, GetCharacterChatAvatarQuery$data> = graphql`
    query GetCharacterChatAvatarQuery($characterId: ID!) {
        getCharacterChatAvatar(characterId: $characterId) {
            id
            chatAvatar
        }        
    }
`;
