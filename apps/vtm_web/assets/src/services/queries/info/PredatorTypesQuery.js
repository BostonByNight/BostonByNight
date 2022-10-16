// @flow

import graphql from 'babel-plugin-relay/macro';
import type {
    PredatorTypesQuery$data,
    PredatorTypesQuery$variables,
} from "./__generated__/PredatorTypesQuery.graphql";
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import {emptyExactObject} from "../../../_base/utils";

export const predatorTypesQuery: Query<PredatorTypesQuery$variables, PredatorTypesQuery$data> = graphql`
    query PredatorTypesQuery {
        predatorTypes {
            id
            name
            description
        }
    }
`;

export function usePredatorTypes(): ?PredatorTypesQuery$data {
    return useCustomLazyLoadQuery(predatorTypesQuery, emptyExactObject());
}
