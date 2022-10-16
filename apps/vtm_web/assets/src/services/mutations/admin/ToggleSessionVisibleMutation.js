// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {
    ToggleSessionVisibleMutation$data
} from "./__generated__/ToggleSessionVisibleMutation.graphql";

const mutation = graphql`
    mutation ToggleSessionVisibleMutation {
        toggleSessionVisible
    }
`;

const mutationPromise = (environment: IEnvironment): Promise<ToggleSessionVisibleMutation$data> => {
    return wrapMutation<ToggleSessionVisibleMutation$data>(environment, mutation, {});
}

export default mutationPromise;
