// @flow

import graphql from 'babel-plugin-relay/macro';
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import type {
    GetCharactersChatAvatarQuery$data,
    GetCharactersChatAvatarQuery$variables,
} from "./__generated__/GetCharactersChatAvatarQuery.graphql";
import {toMap} from "../../../_base/utils";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export const getCharactersChatAvatarQuery: Query<GetCharactersChatAvatarQuery$variables, GetCharactersChatAvatarQuery$data> = graphql`
    query GetCharactersChatAvatarQuery($characterIds: [ID!]) {
        getCharactersChatAvatar(characterIds: $characterIds) {
            character {
                id
            }
            chatAvatar {
                id
                chatAvatar
            }
        }
    }
`;

type CharacterId = string;

type Avatar = string;

/**
 * This hook fetches the character avatar from an array of character ids.
 * @param characterIds The character ids.
 * @return {?Map<string, string>} A map with the character ids as keys and the chat avatar as value.
 */
export const useCharactersChatAvatar = (characterIds: Array<string>): ?Map<CharacterId, Avatar> => {
    const queryAvatars = useCustomLazyLoadQuery(getCharactersChatAvatarQuery, {
        characterIds
    }, {
        fetchPolicy: "store-or-network"
    })?.getCharactersChatAvatar;
    
    const parsedAvatars = queryAvatars
        ?.map(a => {
            if (a?.character?.id != null && a?.chatAvatar?.chatAvatar != null) {
                return [a.character.id, a.chatAvatar.chatAvatar];
            }

            return null;
        });

    return toMap(parsedAvatars);
};
