// @flow

import graphql from 'babel-plugin-relay/macro';
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    HasUserAlreadyBookedQuery$data,
    HasUserAlreadyBookedQuery$variables,
} from "./__generated__/HasUserAlreadyBookedQuery.graphql";
import {emptyExactObject} from "../../../_base/utils";

export const hasUserAlreadyBookedQuery: Query<HasUserAlreadyBookedQuery$variables, HasUserAlreadyBookedQuery$data> = graphql`
    query HasUserAlreadyBookedQuery {
        hasUserAlreadyBooked
    }
`;

export const useHasUserAlreadyBooked = (): boolean =>
    useCustomLazyLoadQuery(hasUserAlreadyBookedQuery, emptyExactObject(), {
        fetchPolicy: "network-only"
    })?.hasUserAlreadyBooked === true;
