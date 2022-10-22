// @flow

import graphql from 'babel-plugin-relay/macro';
import { wrapMutation } from "../../../_base/relay-utils";
import type {
    ResetOccupationSalaryCheckMutation$data,
    ResetOccupationTimerInput
} from "./__generated__/ResetOccupationSalaryCheckMutation.graphql";
import type {IEnvironment} from "relay-runtime";

const mutation = graphql`
    mutation ResetOccupationSalaryCheckMutation($input: ResetOccupationTimerInput!) {
        resetOccupationTimer(input: $input) {
            result {
                id
            }
        }
    }
`;

const mutationPromise = (
    environment: IEnvironment,
    input: ResetOccupationTimerInput
): Promise<ResetOccupationSalaryCheckMutation$data> => {
    return wrapMutation<ResetOccupationSalaryCheckMutation$data>(environment, mutation, input);
}

export default mutationPromise;
