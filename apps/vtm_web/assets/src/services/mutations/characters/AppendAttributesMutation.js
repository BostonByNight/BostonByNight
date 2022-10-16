// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {
    AppendAttributesMutation$data,
    CharacterAttributeRequest
} from "./__generated__/AppendAttributesMutation.graphql";
import type {IEnvironment} from "relay-runtime";

const mutation = graphql`
    mutation AppendAttributesMutation($request: [CharacterAttributeRequest]!, $newStage: Int!) {
        appendCharacterAttributes(request: $request, newStage: $newStage) {
            id
            name
        }
    }
`;

const mutationPromise = (environment: IEnvironment, request: Array<CharacterAttributeRequest>, newStage: number): Promise<AppendAttributesMutation$data> =>
    wrapMutation<AppendAttributesMutation$data>(environment, mutation, { request, newStage });

export default mutationPromise;
