// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {DeleteChatEntryMutation$data} from "./__generated__/DeleteChatEntryMutation.graphql";

const mutation = graphql`
    mutation DeleteChatEntryMutation($id: ID!) {
        deleteChatEntry(input: {
            chatEntryId: $id
        }) {
            result {
                id
            }
        }
    }
`;

const mutationPromise = (environment: IEnvironment, id: string): Promise<DeleteChatEntryMutation$data> => {
    return wrapMutation<DeleteChatEntryMutation$data>(environment, mutation, {
        id
    });
}

export default mutationPromise;
