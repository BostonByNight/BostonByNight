// @flow

import graphql from 'babel-plugin-relay/macro';
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    UserCharactersQuery$data,
    UserCharactersQuery$variables,
} from "./__generated__/UserCharactersQuery.graphql";
import {castNotNull, emptyExactObject, toArray} from "../../../_base/utils";

export const userCharactersQuery: Query<UserCharactersQuery$variables, UserCharactersQuery$data> = graphql`
    query UserCharactersQuery {
        me {
            userCharacters {
                id @required(action: NONE)
                name
                stage @required(action: NONE)
                approved
                isComplete
                clan {
                    name
                }
            }
        }
    }
`;

export type UserCharacter = {
    +id: string,
    +name: ?string,
    chatAvatar?: ?string,
    +stage: number,
    +approved: ?boolean,
    +isComplete: ?boolean,
    +clan: ?{|
      +name: ?string,
    |},
}

export const useUserCharactersQuery = (reloadCount?: number): Array<UserCharacter> => {
    const result = useCustomLazyLoadQuery(userCharactersQuery, emptyExactObject(), {
        fetchPolicy: "store-and-network",
        fetchKey: reloadCount ?? 0
    })
        ?.me
        ?.userCharacters;

    return (toArray(result) ?? [])
        .filter(c => c != null)
        .map(castNotNull)
        .map(x => ({
            ...x
        }));
};
