// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    GetCharactersAvatarQuery$data,
    GetCharactersAvatarQuery$variables,
} from "./__generated__/GetCharactersAvatarQuery.graphql";

export const getCharactersAvatarQuery: Query<GetCharactersAvatarQuery$variables, GetCharactersAvatarQuery$data> = graphql`
    query GetCharactersAvatarQuery($characterIds: [ID!]) {
        getCharactersAvatar(characterIds: $characterIds) {
            character {
                id
            }
            avatar {
                id
                avatar
            }
        }
    }
`;
