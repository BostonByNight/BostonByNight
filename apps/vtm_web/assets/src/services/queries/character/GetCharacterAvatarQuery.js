// @flow

import type {
    GetCharacterAvatarQuery$data,
    GetCharacterAvatarQuery$variables,
} from "./__generated__/GetCharacterAvatarQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

import graphql from 'babel-plugin-relay/macro';

export const getCharacterAvatarQuery: Query<GetCharacterAvatarQuery$variables, GetCharacterAvatarQuery$data> = graphql`
    query GetCharacterAvatarQuery($id: ID!) {
        getCharacterAvatar(characterId: $id) {
            id
            avatar
        }
    }
`;
