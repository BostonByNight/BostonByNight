// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {RouseCheckInput, RouseCheckMutation$data} from "./__generated__/RouseCheckMutation.graphql";

const mutation = graphql`
    mutation RouseCheckMutation($input: RouseCheckInput!) {
        rouseCheck(input: $input) {
            result {
                id
                character {
                    id
                }
                text
            }
        }
    }
`;

const mutationPromise = (environment: IEnvironment, request: RouseCheckInput): Promise<RouseCheckMutation$data> => {
    return wrapMutation<RouseCheckMutation$data>(environment, mutation, {input: request});
}

export default mutationPromise;
