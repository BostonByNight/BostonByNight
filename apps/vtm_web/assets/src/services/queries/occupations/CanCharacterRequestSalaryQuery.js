// @flow

import graphql from 'babel-plugin-relay/macro';
import type {CanCharacterRequestSalaryQuery$variables, CanCharacterRequestSalaryQuery$data} from "./__generated__/CanCharacterRequestSalaryQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export const CanCharacterRequestSalaryQuery: Query<CanCharacterRequestSalaryQuery$variables, CanCharacterRequestSalaryQuery$data> = graphql`
    query CanCharacterRequestSalaryQuery($characterId: ID!) {
        canCharacterRequestSalary(characterId: $characterId)
    }
`;
