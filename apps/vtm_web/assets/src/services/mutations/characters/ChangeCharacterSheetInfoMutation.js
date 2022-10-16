// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {
    ChangeCharacterSheetInfoMutation$data,
    ChangeCharacterSheetInfoMutation$variables
} from "./__generated__/ChangeCharacterSheetInfoMutation.graphql";

const mutation = graphql`
    mutation ChangeCharacterSheetInfoMutation($characterId: ID!, $request: ChangeSheetInfoRequest!) {
        changeSheetInfo(input: {
            characterId: $characterId,
            request: $request
        }) {
            result {
                id
            }
        }
    }
`;

const mutationPromise = (
    environment: IEnvironment,
    characterId: string,
    request: ChangeCharacterSheetInfoMutation$variables): Promise<?string> => {
    return wrapMutation<ChangeCharacterSheetInfoMutation$data>(environment, mutation, {
        characterId,
        request
    })?.then(m => m?.changeSheetInfo?.result?.id);
}

export default mutationPromise;
