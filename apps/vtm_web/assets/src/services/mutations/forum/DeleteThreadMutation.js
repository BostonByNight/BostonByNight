// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {DeleteThreadMutation$data} from "./__generated__/DeleteThreadMutation.graphql";

const mutation = graphql`
    mutation DeleteThreadMutation($threadId: ID!) {
        deleteForumThread(input: {
            threadId: $threadId
        }) {
            result {
                id
            }
        }
    }
`;

const mutationPromise = (environment: IEnvironment, threadId: string): Promise<DeleteThreadMutation$data> => {
    return wrapMutation<DeleteThreadMutation$data>(environment, mutation, {
        threadId
    });
};

export default mutationPromise;
