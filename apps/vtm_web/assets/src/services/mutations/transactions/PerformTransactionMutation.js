// @flow

import graphql from 'babel-plugin-relay/macro';
import { wrapMutation } from "../../../_base/relay-utils";
import type {InsertTransactionInput, InsertTransactionMutation$data} from "./__generated__/InsertTransactionMutation.graphql";
import type {IEnvironment} from "relay-runtime";

const mutation = graphql`
    mutation InsertTransactionMutation($input: InsertTransactionInput!) {
        insertTransaction(input: $input) {
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
    input: InsertTransactionInput
): Promise<InsertTransactionMutation$data> => {
    return wrapMutation<InsertTransactionMutation$data>(environment, mutation, input);
}

export default mutationPromise;
