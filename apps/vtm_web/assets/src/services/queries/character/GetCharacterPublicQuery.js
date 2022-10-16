// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    GetCharacterPublicQuery$data,
    GetCharacterPublicQuery$variables,
} from "./__generated__/GetCharacterPublicQuery.graphql";

export const getCharacterPublicQuery: Query<GetCharacterPublicQuery$variables, GetCharacterPublicQuery$data> = graphql`
    query GetCharacterPublicQuery($id: ID!) {
        getCharacterPublicInfo(id: $id) {
            id,
            ...CharacterFragments_characterInfo
            ...CharacterFragments_characterSheet
            ...CharacterFragments_characterOff
        }
    }
`;
