// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {SetHavenInfoMutation$data, SetHavenInfoRequest} from "./__generated__/SetHavenInfoMutation.graphql";

const mutation = graphql`
    mutation SetHavenInfoMutation($havenId: ID!, $request: SetHavenInfoRequest!) {
        setHavenInfo(input: {
            havenId: $havenId,
            request: $request
        }) {
            result {
                id
                name
            }
        }
    }
`;

const mutationPromise = (
    environment: IEnvironment,
    havenId: string,
    request: SetHavenInfoRequest): Promise<SetHavenInfoMutation$data> => {
    return wrapMutation<SetHavenInfoMutation$data>(environment, mutation, {
        havenId,
        request
    });
}

export default mutationPromise;
