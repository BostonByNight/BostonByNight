// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {AddUserToChatMutation$data} from "./__generated__/AddUserToChatMutation.graphql";

const mutation = graphql`
    mutation AddUserToChatMutation($chatId: ID!, $userId: ID!) {
        addUserToChat(request: {
            chatMapId: $chatId,
            guestUserId: $userId
        }) {
            id
        }
    }
`;

const mutationPromise = (environment: IEnvironment, chatId: string, userId: string): Promise<boolean> =>
    wrapMutation<AddUserToChatMutation$data>(environment, mutation, {
        chatId,
        userId
    })?.then(x => x?.addUserToChat?.id != null);

export default mutationPromise;
