// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {
    CharacterCreationRequest,
    CreateNewNpcMutation$data
} from "./__generated__/CreateNewNpcMutation.graphql";

const mutation = graphql`
    mutation CreateNewNpcMutation($request: CharacterCreationRequest!) {
        createNpc(input: {
            request: $request
        }) {
            character {
                id
                clan {
                    name
                }
            }
        }
    }
`;

const mutationPromise = (environment: IEnvironment, request: CharacterCreationRequest): Promise<CreateNewNpcMutation$data> => {
    return wrapMutation<CreateNewNpcMutation$data>(environment, mutation, {
        request: {
            ...request,
            clanId: request.clanId
        }
    });
};

export default mutationPromise;
