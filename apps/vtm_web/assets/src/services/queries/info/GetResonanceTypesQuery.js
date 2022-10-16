// @flow

import graphql from 'babel-plugin-relay/macro';
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import type {
    GetResonanceTypesQuery$data,
    GetResonanceTypesQuery$variables,
} from "./__generated__/GetResonanceTypesQuery.graphql";
import {castNotNull, emptyExactObject, isNotNullNorEmpty,} from "../../../_base/utils";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export type ResonanceType = string

export const getResonanceTypesQuery: Query<GetResonanceTypesQuery$variables, GetResonanceTypesQuery$data> = graphql`
    query GetResonanceTypesQuery {
        getResonanceTypes {
            result
        }
    }
`;

export const useResonanceTypes = (): $ReadOnlyArray<ResonanceType> =>
    (useCustomLazyLoadQuery(getResonanceTypesQuery, emptyExactObject(), {
        fetchPolicy: "store-or-network"
    })?.getResonanceTypes?.result ?? [])
        .filter(isNotNullNorEmpty)
        .map(castNotNull);
