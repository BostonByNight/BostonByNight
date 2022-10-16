// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {
    UseWillpowerChatMutation$data,
    UseWillpowerInput
} from "./__generated__/UseWillpowerChatMutation.graphql";

const mutation = graphql`
    mutation UseWillpowerChatMutation($input: UseWillpowerInput!) {
        useWillpower(input: $input) {
            result {
                id
                text
                character {
                    id
                }
                chatMap {
                    id
                }
            }
        }
    }
`;

const mutationPromise = (environment: IEnvironment, request: UseWillpowerInput): Promise<UseWillpowerChatMutation$data> => {
    return wrapMutation<UseWillpowerChatMutation$data>(environment, mutation, {input: request});
}

export default mutationPromise;
