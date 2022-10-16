// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {BookChatMapMutation$data} from "./__generated__/BookChatMapMutation.graphql";

const mutation = graphql`
    mutation BookChatMapMutation($chatId: ID!) {
        bookChatMap(chatId: $chatId) {
            id
        }
    }
`;

const mutationPromise = (environment: IEnvironment, chatId: string): Promise<boolean> =>
    wrapMutation<BookChatMapMutation$data>(environment, mutation, {chatId})
        ?.then(x => x?.bookChatMap?.id != null);

export default mutationPromise;
