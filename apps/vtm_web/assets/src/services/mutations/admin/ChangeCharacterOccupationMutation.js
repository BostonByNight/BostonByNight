// @flow

import graphql from 'babel-plugin-relay/macro';
import { wrapMutation } from "../../../_base/relay-utils";
import type {
    ChangeCharacterOccupationMutation$data,
    ChangeCharacterOccupationInput
} from "./__generated__/ChangeCharacterOccupationMutation.graphql";
import type {IEnvironment} from "relay-runtime";

const mutation = graphql`
    mutation ChangeCharacterOccupationMutation($input: ChangeCharacterOccupationInput!) {
        changeCharacterOccupation(input: $input) {
            result {
                id
            }
        }
    }
`;

const mutationPromise = (
    environment: IEnvironment,
    input: ChangeCharacterOccupationInput
): Promise<ChangeCharacterOccupationMutation$data> => {
    return wrapMutation<ChangeCharacterOccupationMutation$data>(environment, mutation, {input})
}

export default mutationPromise;
