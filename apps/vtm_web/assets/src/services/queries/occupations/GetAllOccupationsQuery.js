// @flow

import graphql from 'babel-plugin-relay/macro';
import type {GetAllOccupationsQuery$variables, GetAllOccupationsQuery$data} from "./__generated__/GetAllOccupationsQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export const GetAllOccupationsQuery: Query<GetAllOccupationsQuery$variables, GetAllOccupationsQuery$data> = graphql`
    query GetAllOccupationsQuery {
        getOccupations {
            id
            name
            description
        }
    }
`;
