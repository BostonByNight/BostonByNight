// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapQuery} from "../../../_base/relay-utils";
import type {IEnvironment} from "relay-runtime";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    UserNameExistsQuery$data,
    UserNameExistsQuery$variables,
} from "./__generated__/UserNameExistsQuery.graphql";

export const userNameExistsQuery: Query<UserNameExistsQuery$variables, UserNameExistsQuery$data> = graphql`
    query UserNameExistsQuery($name: String!) {
        userNameExists(name: $name)
    }
`;

export const userNameExists = (environment: IEnvironment, name: string): Promise<boolean> =>
    wrapQuery(environment, userNameExistsQuery, {name})
        .then(r => r?.userNameExists);
