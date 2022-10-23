// @flow

import graphql from 'babel-plugin-relay/macro';
import { wrapMutation } from "../../../_base/relay-utils";
import type {
    RefreshCharacterOccupationSalaryInput,
    RefreshCharacterOccupationSalaryMutation$data
} from "./__generated__/RefreshCharacterOccupationSalaryMutation.graphql";
import type {IEnvironment} from "relay-runtime";

const mutation = graphql`
    mutation RefreshCharacterOccupationSalaryMutation($input: RefreshCharacterOccupationSalaryInput!) {
        refreshCharacterOccupationSalary(input: $input) {
            result {
                type
                message
            }
        }
    }
`;

const mutationPromise = (
    environment: IEnvironment,
    input: RefreshCharacterOccupationSalaryInput
): Promise<RefreshCharacterOccupationSalaryMutation$data> => {
    return wrapMutation<RefreshCharacterOccupationSalaryMutation$data>(environment, mutation, {input});
}

export default mutationPromise;
