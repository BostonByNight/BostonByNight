// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {ResetDangerMutation$data} from "./__generated__/ResetDangerMutation.graphql";

const mutation = graphql`
    mutation ResetDangerMutation {
        resetDanger {
            result
        }
    }
`;

const mutationPromise = (environment: IEnvironment): Promise<ResetDangerMutation$data> => {
    return wrapMutation<ResetDangerMutation$data>(environment, mutation, {});
}

export default mutationPromise;
