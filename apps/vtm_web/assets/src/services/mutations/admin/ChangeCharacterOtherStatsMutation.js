// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {
    ChangeCharacterOtherStatsInput,
    ChangeCharacterOtherStatsMutation$data
} from "./__generated__/ChangeCharacterOtherStatsMutation.graphql";

const mutation = graphql`
    mutation ChangeCharacterOtherStatsMutation($input: ChangeCharacterOtherStatsInput!) {
        changeCharacterOtherStats(input: $input) {
            result {
                id
            }
        }
    }
`;

const mutationPromise = (environment: IEnvironment, request: ChangeCharacterOtherStatsInput): Promise<ChangeCharacterOtherStatsMutation$data> => {
    return wrapMutation<ChangeCharacterOtherStatsMutation$data>(environment, mutation, {input: request});
}

export default mutationPromise;
