// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {
    ChangeCharacterAttributeInput,
    ChangeCharacterAttributeMutation$data
} from "./__generated__/ChangeCharacterAttributeMutation.graphql";

const mutation = graphql`
    mutation ChangeCharacterAttributeMutation($input: ChangeCharacterAttributeInput!) {
        changeCharacterAttribute(input: $input) {
            result
        }
    }
`;

const mutationPromise = (environment: IEnvironment, request: ChangeCharacterAttributeInput): Promise<ChangeCharacterAttributeMutation$data> => {
    return wrapMutation<ChangeCharacterAttributeMutation$data>(environment, mutation, {input: request});
}

export default mutationPromise;
