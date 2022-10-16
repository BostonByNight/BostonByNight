// @flow

import graphql from 'babel-plugin-relay/macro';
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import type {GetAllNpcsQuery$data, GetAllNpcsQuery$variables,} from "./__generated__/GetAllNpcsQuery.graphql";
import {emptyArray, emptyExactObject} from "../../../_base/utils";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export const getAllNpcsQuery: Query<GetAllNpcsQuery$variables, GetAllNpcsQuery$data> = graphql`
    query GetAllNpcsQuery {
        allNpcs {
            id
            name
            isComplete
            approved
            clan {
                id
                name
            }
        }
    }
`;

export type Npc = {
    id: string;
    name: ?string;
    chatAvatar?: ?string;
    isComplete: ?boolean;
    approved: ?boolean;
    clan: ?{
        id: ?string;
        name: ?string;
    }
};

export const useNpcsQuery = (reloadCount: number): Array<Npc> =>
    useCustomLazyLoadQuery(getAllNpcsQuery, emptyExactObject(), {
        fetchPolicy: "store-and-network",
        fetchKey: reloadCount
    })?.allNpcs?.map(n => ({
        id: n?.id ?? "",
        name: n?.name,
        isComplete: n?.isComplete,
        approved: n?.approved,
        clan: {
            id: n?.clan?.id,
            name: n?.clan?.name
        }
    })) ?? emptyArray<Npc>();
