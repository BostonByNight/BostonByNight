// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {
    ChangeCharacterHuntDifficultyInput,
    ChangeCharacterHuntDifficultyMutation$data
} from "./__generated__/ChangeCharacterHuntDifficultyMutation.graphql";

const mutation = graphql`
    mutation ChangeCharacterHuntDifficultyMutation($input: ChangeCharacterHuntDifficultyInput!) {
        changeCharacterHuntDifficulty(input: $input) {
            result {
                id
            }
        }
    }
`;

const mutationPromise = (
    environment: IEnvironment,
    request: ChangeCharacterHuntDifficultyInput): Promise<ChangeCharacterHuntDifficultyMutation$data> =>
    wrapMutation<ChangeCharacterHuntDifficultyMutation$data>(environment, mutation, {
        input: request
    });

export default mutationPromise;
