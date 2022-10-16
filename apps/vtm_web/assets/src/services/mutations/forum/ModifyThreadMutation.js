// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {ModifyForumThreadInput, ModifyThreadMutation$data} from "./__generated__/ModifyThreadMutation.graphql";

const mutation = graphql`
    mutation ModifyThreadMutation($request: ModifyForumThreadInput!) {
        modifyForumThread(input: $request) {
            result {
                id
            }
        }
    }
`;

const mutationPromise = (environment: IEnvironment, request: ModifyForumThreadInput): Promise<ModifyThreadMutation$data> => {
    return wrapMutation<ModifyThreadMutation$data>(environment, mutation, {
        request
    });
};

export default mutationPromise;
