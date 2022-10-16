// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {
    AssignNpcAttributesMutation$data,
    NpcAttributesRequest,
} from "./__generated__/AssignNpcAttributesMutation.graphql";

const mutation = graphql`
    mutation AssignNpcAttributesMutation($characterId: ID!, $request: NpcAttributesRequest!) {
        assignNpcAttributes(input: {
            characterId: $characterId,
            request: $request
        }) {
            response {
                id
            }
        }
    }
`;

const mutationPromise = (environment: IEnvironment, characterId: string, request: NpcAttributesRequest): Promise<AssignNpcAttributesMutation$data> => {
    return wrapMutation<AssignNpcAttributesMutation$data>(environment, mutation, {
        characterId,
        request
    });
}

export default mutationPromise;
