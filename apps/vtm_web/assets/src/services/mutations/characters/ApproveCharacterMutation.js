// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {ApproveCharacterMutationResponse} from "./__generated__/ApproveCharacterMutation.graphql";

const mutation = graphql`
    mutation ApproveCharacterMutation($characterId: ID!, $reason: String) {
        approveCharacter(characterId: $characterId, reason: $reason)
    }
`;

const mutationPromise = (environment: IEnvironment, characterId: string, reason: string): Promise<boolean> => {
    return wrapMutation<ApproveCharacterMutationResponse>(environment, mutation, {
        characterId,
        reason
    })?.then(r => r?.approveCharacter === true);
}

export default mutationPromise;
