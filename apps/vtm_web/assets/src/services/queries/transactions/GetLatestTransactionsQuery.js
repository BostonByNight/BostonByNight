// @flow

import graphql from 'babel-plugin-relay/macro';
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export const getLatestTransactionsQuery: any = graphql`
    query GetLatestTransactionsQuery {
        getLatestTransactions {
            id
            characterId
            toCharacterId
            amount
            reason
            transactionTime
        }
    }
`;