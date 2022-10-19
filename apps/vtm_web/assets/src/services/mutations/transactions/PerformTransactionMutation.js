// @flow

import graphql from 'babel-plugin-relay/macro';
import { wrapMutation } from "../../../_base/relay-utils";
import type {PerformTransactionInput, PerformTransactionMutation$data} from "./__generated__/PerformTransactionMutation.graphql";
import type {IEnvironment} from "relay-runtime";

const mutation = graphql`
    mutation PerformTransactionMutation($input: PerformTransactionInput!) {
        performTransaction(input: $input) {
            result {
                id
                characterId
                toCharacterId
                amount
                reason
                transactionTime
            }
        }
    }
`;

const mutationPromise = (
    environment: IEnvironment,
    input: PerformTransactionInput
): Promise<PerformTransactionMutation$data> => {
    return wrapMutation<PerformTransactionMutation$data>(environment, mutation, {input});
}

export default mutationPromise;
