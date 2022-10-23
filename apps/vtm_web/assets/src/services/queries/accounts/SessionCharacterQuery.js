// @flow

import graphql from 'babel-plugin-relay/macro';
import {wrapQuery} from "../../../_base/relay-utils";
import type {
    SessionCharacterQuery$data,
    SessionCharacterQuery$variables,
} from "./__generated__/SessionCharacterQuery.graphql";
import type {IEnvironment} from "relay-runtime";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import {emptyExactObject} from "../../../_base/utils";

const sessionCharacterQuery: Query<SessionCharacterQuery$variables, SessionCharacterQuery$data> = graphql`
    query SessionCharacterQuery {
        getSessionCharacter {
            id
            name
            approved
            clan {
                id
                name
            }
        }
    }
`;

// export const useSessionCharacter = (): SessionCharacterQuery$data =>
//     useCustomLazyLoadQuery(sessionCharacterQuery, emptyExactObject());

export const getSessionCharacter = (environment: IEnvironment): Promise<?SessionCharacterQuery$data> =>
    wrapQuery(environment, sessionCharacterQuery, emptyExactObject())
