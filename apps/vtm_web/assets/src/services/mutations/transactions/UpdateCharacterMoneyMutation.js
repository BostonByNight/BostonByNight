// @flow

import graphql from 'babel-plugin-relay/macro';
import { wrapMutation } from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {
    UpdateCharacterMoneyInput,
    UpdateCharacterMoneyMutation$data
} from "./__generated__/UpdateCharacterMoneyMutation.graphql";

const mutation = graphql`
    mutation UpdateCharacterMoneyMutation($input: UpdateCharacterMoneyInput!) {
        updateCharacterMoney(input: $input) {
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
    input: UpdateCharacterMoneyInput
): Promise<UpdateCharacterMoneyMutation$data> => {
    return wrapMutation<UpdateCharacterMoneyMutation$data>(environment, mutation, input);
}

export default mutationPromise;
