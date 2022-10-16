// @flow

import type {
    GetCharacterStageQuery$data,
    GetCharacterStageQuery$variables,
} from "./__generated__/GetCharacterStageQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

import graphql from 'babel-plugin-relay/macro';

export const getCharacterStageQuery: Query<GetCharacterStageQuery$variables, GetCharacterStageQuery$data> = graphql`
    query GetCharacterStageQuery($id: ID!) {
        getCharacter(id: $id) {
            id
            stage
            isComplete
            approved
        }
    }
`;
