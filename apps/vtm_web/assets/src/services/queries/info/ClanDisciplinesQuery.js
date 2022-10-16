// @flow

import graphql from 'babel-plugin-relay/macro';
import type {
    ClanDisciplinesQuery$data,
    ClanDisciplinesQuery$variables,
} from "./__generated__/ClanDisciplinesQuery.graphql";
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export const clanDisciplinesQuery: Query<ClanDisciplinesQuery$variables, ClanDisciplinesQuery$data> = graphql`
    query ClanDisciplinesQuery($clanId: ID!) {
        clanDisciplines(clanId: $clanId) {
            id
            name
            description
        }
    }
`;

export const useClanDisciplines = (clanId: string): ?ClanDisciplinesQuery$data =>
    useCustomLazyLoadQuery(clanDisciplinesQuery, {clanId});
