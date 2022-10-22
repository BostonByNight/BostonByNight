// @flow

import graphql from 'babel-plugin-relay/macro';
import type {GetCharacterOccupationQuery$variables, GetCharacterOccupationQuery$data} from "./__generated__/GetCharacterOccupationQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export const GetCharacterOccupationQuery: Query<GetCharacterOccupationQuery$variables, GetCharacterOccupationQuery$data> = graphql`
    query GetCharacterOccupationQuery($characterId: ID!) {
        getCharacterOccupation(characterId: $characterId) {
            id
            characterId
            occupation {
                id
                name
            }
            level
            lastChecked
        }
    }
`;
