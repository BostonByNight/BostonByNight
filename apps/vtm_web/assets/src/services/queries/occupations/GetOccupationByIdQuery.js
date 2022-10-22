// @flow

import graphql from 'babel-plugin-relay/macro';
import type {GetOccupationByIdQuery$variables, GetOccupationByIdQuery$data} from "./__generated__/GetOccupationByIdQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import {isNotNullNorEmpty} from "../../../_base/utils";

export const GetOccupationByIdQuery: Query<GetOccupationByIdQuery$variables, GetOccupationByIdQuery$data> = graphql`
    query GetOccupationByIdQuery($id: ID!) {
        getOccupation(occupationId: $id) {
            id
            name
            description
            level1Name
            level1Salary
            level2Name
            level2Salary
            level3Name
            level3Salary
            level4Name
            level4Salary
            level5Name
            level5Salary
            level6Name
            level6Salary
        }
    }
`;

type Occupation = {
    +level2Name: ?string;
}

export const isOccupationCorporation = (occupation: ?Occupation): boolean =>
    isNotNullNorEmpty(occupation?.level2Name)
