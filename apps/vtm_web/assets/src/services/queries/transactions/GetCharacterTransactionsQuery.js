// @flow

import graphql from 'babel-plugin-relay/macro';
import type {
    GetCharacterTransactionsQuery$data,
    GetCharacterTransactionsQuery$variables
} from "./__generated__/GetCharacterTransactionsQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export const getCharacterTransactionsQuery: Query<GetCharacterTransactionsQuery$variables, GetCharacterTransactionsQuery$data> = graphql`
    query GetCharacterTransactionsQuery($characterId: ID!) {
        getCharacterTransactions(characterId: $characterId) {
            id
            characterId
            characterName
            toCharacterId
            toCharacterName
            amount
            reason
            transactionTime
        }
    }
`;