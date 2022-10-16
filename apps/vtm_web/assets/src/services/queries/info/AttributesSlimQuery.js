// @flow

import graphql from 'babel-plugin-relay/macro';
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import type {Attribute, AttributeSections, AttributeTypeNames,} from "./AttributesQuery";
import {attributesDefaultSortFunction} from "./AttributesQuery";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    AttributesSlimQuery$data,
    AttributesSlimQuery$variables,
} from "./__generated__/AttributesSlimQuery.graphql";
import {emptyExactObject, toNotNullArray} from "../../../_base/utils";

export const attributesSlimQuery: Query<AttributesSlimQuery$variables, AttributesSlimQuery$data> = graphql`
    query AttributesSlimQuery {
        attributes {
            id @required(action: LOG)
            name @required(action: NONE)
            order @required(action: LOG)
            attributeType {
                name
                section
            }
        }
    }
`;

const useAttributesSlimQuery = (): Array<Attribute> => {
    const attributes = useCustomLazyLoadQuery(attributesSlimQuery, emptyExactObject())?.attributes;

    const mappedAttributes: Array<Attribute> = toNotNullArray(attributes)
        .map(x => ({
            id: x.id,
            name: x.name,
            order: x.order,
            attributeType: {
                name: ((x.attributeType?.name: any): AttributeTypeNames),
                section: ((x.attributeType?.section: any): AttributeSections)
            }
        }));

    return mappedAttributes
        .sort((a, b) => attributesDefaultSortFunction(a, b));
};

export default useAttributesSlimQuery;
