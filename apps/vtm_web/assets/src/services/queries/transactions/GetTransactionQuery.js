// @flow

import graphql from 'babel-plugin-relay/macro';
import type {GetTransactionQuery$variables, GetTransactionQuery$data} from "./__generated__/GetTransactionQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export const GetTransactionQuery: Query<GetTransactionQuery$variables, GetTransactionQuery$data> = graphql`
    query GetTransactionQuery($transactionId: ID!) {
        getTransaction(transactionId: $transactionId) {
            id
            characterId
            toCharacterId
            amount
            reason
            transactionTime
        }
    }
`;
