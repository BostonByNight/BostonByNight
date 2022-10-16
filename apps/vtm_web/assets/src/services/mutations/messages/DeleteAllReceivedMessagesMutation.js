// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {
    DeleteAllReceivedMessagesMutation$data
} from "./__generated__/DeleteAllReceivedMessagesMutation.graphql";

const mutation = graphql`
    mutation DeleteAllReceivedMessagesMutation {
        deleteAllReceivedMessage
    }
`;

const mutationPromise = (environment: IEnvironment): Promise<DeleteAllReceivedMessagesMutation$data> => {
    return wrapMutation<DeleteAllReceivedMessagesMutation$data>(environment, mutation, {});
}

export default mutationPromise;
