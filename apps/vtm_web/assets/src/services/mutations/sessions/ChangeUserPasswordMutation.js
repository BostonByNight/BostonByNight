// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapMutation} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {ChangeUserPasswordMutation$data} from "./__generated__/ChangeUserPasswordMutation.graphql";

const mutation = graphql`
    mutation ChangeUserPasswordMutation($oldPassword: String!, $newPassword: String!, $repeatPassword: String!) {
        updateUserPassword(oldPassword: $oldPassword, newPassword: $newPassword, repeatPassword: $repeatPassword)
    }
`;

const mutationPromise = (environment: IEnvironment, oldPassword: string, newPassword: string, repeatPassword: string): Promise<boolean> =>
    wrapMutation<ChangeUserPasswordMutation$data>(environment, mutation, {
        oldPassword,
        newPassword,
        repeatPassword
    }).then(x => x?.updateUserPassword ?? false);

export default mutationPromise;
