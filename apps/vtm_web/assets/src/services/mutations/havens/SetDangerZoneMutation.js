// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {
    SetDangerZoneMutation$data,
    SetDangerZoneRequest
} from "./__generated__/SetDangerZoneMutation.graphql.js";

const mutation = graphql`
    mutation SetDangerZoneMutation($havenId: ID!, $request: SetDangerZoneRequest!) {
        setDangerZone(input: {
            havenId: $havenId,
            request: $request
        }) {
            result
        }
    }
`;

const mutationPromise = (environment: IEnvironment, havenId: string, request: SetDangerZoneRequest): Promise<SetDangerZoneMutation$data> => {
    return wrapMutation<SetDangerZoneMutation$data>(environment, mutation, {
        havenId,
        request
    });
}

export default mutationPromise;
