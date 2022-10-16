// @flow

import graphql from 'babel-plugin-relay/macro';
import type {IEnvironment} from "relay-runtime";
import {wrapMutation} from "../../../_base/relay-utils";
import type {FinalizeCharacterMutation$data} from "./__generated__/FinalizeCharacterMutation.graphql";

const finalizeCharacterMutation = graphql`
    mutation FinalizeCharacterMutation($characterId: ID!) {
        finalizeCharacter(characterId: $characterId) {
            id
        }
    }
`;

const mutationPromise = (environment: IEnvironment, characterId: string): Promise<FinalizeCharacterMutation$data> =>
    wrapMutation<FinalizeCharacterMutation$data>(environment, finalizeCharacterMutation, {
        characterId
    });

export default mutationPromise;
