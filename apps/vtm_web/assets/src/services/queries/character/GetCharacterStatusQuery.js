// @flow

import graphql from 'babel-plugin-relay/macro';
import type {
    GetCharacterStatusQuery$data,
    GetCharacterStatusQuery$variables
} from "./__generated__/GetCharacterStatusQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export const getCharacterStatusQuery: Query<GetCharacterStatusQuery$variables, GetCharacterStatusQuery$data> = graphql`
    query GetCharacterStatusQuery($characterId: ID!) {
        getCharacterStatus(characterId: $characterId) {
            humanity
            lastHunt
            lastResonance
            lastResonanceIntensity
            hunger
            stains
            bloodPotency
            willpower
            willpowerDamage
            health
            damage
            aggravatedDamage
        }
    }
`;
