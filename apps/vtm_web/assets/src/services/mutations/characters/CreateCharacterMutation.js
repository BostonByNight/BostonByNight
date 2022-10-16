// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {
    CharacterCreationRequest,
    CreateCharacterMutation$data
} from "./__generated__/CreateCharacterMutation.graphql";
import type {IEnvironment} from "relay-runtime";

const mutation = graphql`
    mutation CreateCharacterMutation($request: CharacterCreationRequest!) {
        createCharacter(request: $request) {
            id
            name
            clan {
                name
            }
        }
    }
`;

const mutationPromise = (environment: IEnvironment, request: CharacterCreationRequest): Promise<CreateCharacterMutation$data> => {
    return wrapMutation<CreateCharacterMutation$data>(environment, mutation, {
        request: {
            ...request,
            clanId: request.clanId
        }
    });
}

export default mutationPromise;
