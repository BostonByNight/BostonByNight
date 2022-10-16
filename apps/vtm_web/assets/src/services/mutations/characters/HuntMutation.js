// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {HuntInput, HuntMutation$data} from "./__generated__/HuntMutation.graphql";

const mutation = graphql`
    mutation HuntMutation($input: HuntInput!) {
        hunt(input: $input) {
            result
        }
    }
`;

const mutationPromise = (environment: IEnvironment, input: HuntInput): Promise<HuntMutation$data> => {
    return wrapMutation<HuntMutation$data>(environment, mutation, {
        input
    });
};

export default mutationPromise;
