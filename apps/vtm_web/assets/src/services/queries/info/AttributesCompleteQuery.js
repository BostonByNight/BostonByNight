// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    AttributesCompleteQuery$data,
    AttributesCompleteQuery$variables,
} from "./__generated__/AttributesCompleteQuery.graphql";

export const attributesCompleteQuery: Query<AttributesCompleteQuery$variables, AttributesCompleteQuery$data> = graphql`
    query AttributesCompleteQuery {
        attributes {
            id
            name
            order
            description
            attributeType {
                id
                name
                section
            }
        }
    }
`;
