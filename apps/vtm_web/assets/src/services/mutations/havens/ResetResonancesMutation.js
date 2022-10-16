// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {ResetResonancesMutation$data} from "./__generated__/ResetResonancesMutation.graphql";

const mutation = graphql`
    mutation ResetResonancesMutation {
        resetResonances {
            result
        }
    }
`;

const mutationPromise = (environment: IEnvironment): Promise<ResetResonancesMutation$data> => {
    return wrapMutation<ResetResonancesMutation$data>(environment, mutation, {});
}

export default mutationPromise;
