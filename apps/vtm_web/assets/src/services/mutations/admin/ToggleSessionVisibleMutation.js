// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {Character} from "../../queries/character/GetCharacterCompleteQuery";

const mutation = graphql`
    mutation ToggleSessionVisibleMutation {
        toggleSessionVisible
    }
`;

const mutationPromise = (environment: IEnvironment): Promise<boolean> => {
    return wrapMutation<?Character>(environment, mutation, {});
}

export default mutationPromise;
