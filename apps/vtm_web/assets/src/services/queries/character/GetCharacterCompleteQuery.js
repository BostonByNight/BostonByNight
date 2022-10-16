// @flow

import graphql from 'babel-plugin-relay/macro';
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import type {
    GetCharacterCompleteQuery$variables,
    GetCharacterCompleteQuery$data,
} from "./__generated__/GetCharacterCompleteQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export const getCharacterCompleteQuery: Query<GetCharacterCompleteQuery$variables, GetCharacterCompleteQuery$data> = graphql`
    query GetCharacterCompleteQuery($id: ID!) {
        getCharacter(id: $id) {
            ...CharacterFragments_characterInfo @relay(mask: false)
            ...CharacterFragments_characterConcealedInfo @relay(mask: false)
            ...CharacterFragments_characterSheet @relay(mask: false)
            ...CharacterFragments_characterStats @relay(mask: false)
            ...CharacterFragments_characterState @relay(mask: false)
        }
    }
`;

export type Character = {|
    +id: string,
    +name: ?string,
    +isNpc: ?boolean,
    +biography: ?string,
    +disciplinePowers: ?string,
    +specialties: ?string,
    +objects: ?string,
    +clan: ?{|
        +id: string,
        +name: ?string,
    |},
    +avatar: ?string,
    +description: ?string,
    +humanity: ?number,
    +experience: ?number,
    +totalExperience: ?number,
    +generation: ?number,
    +hunger: ?number,
    +health: ?number,
    +damage: ?number,
    +aggravatedDamage: ?number,
    +willpower: ?number,
    +willpowerDamage: ?number,
    +stains: ?number,
    +bloodPotency: ?number,
    +isAwake: ?boolean,
    +lastAwake: ?any,
    +lastHunt: ?any,
    +huntDifficulty: ?number,
    +lastResonance: ?string,
    +lastResonanceIntensity: ?number,
    +stage: ?number,
    +approved: ?boolean,
    +isComplete: ?boolean,
    +advantages: ?string,
    +notes: ?string,
    +convictions: ?string,
    +predatorType: ?{|
        +id: string,
        +name: ?string,
    |},
|};

export const useCharacterCompleteQuery = (characterId: string): ?Character => {
    return useCustomLazyLoadQuery(getCharacterCompleteQuery, { id: characterId })?.getCharacter;
};
