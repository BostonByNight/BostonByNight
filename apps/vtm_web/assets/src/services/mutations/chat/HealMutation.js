// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {HealMutation$data} from "./__generated__/HealMutation.graphql";

const mutation = graphql`
    mutation HealMutation($characterId: ID!, $chatMapId: ID!) {
        heal(input: {
            characterId: $characterId,
            chatMapId: $chatMapId
        }) {
            result {
                id
                character {
                    id
                }
                text
            }
        }
    }
`;

const mutationPromise = (environment: IEnvironment, characterId: string, chatMapId: string): Promise<HealMutation$data> => {
    return wrapMutation<HealMutation$data>(environment, mutation, {
        characterId,
        chatMapId
    });
}

export default mutationPromise;
