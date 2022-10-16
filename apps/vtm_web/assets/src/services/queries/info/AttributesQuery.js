// @flow

import graphql from 'babel-plugin-relay/macro';
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import type {AttributesQuery$data, AttributesQuery$variables,} from "./__generated__/AttributesQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import {emptyExactObject} from "../../../_base/utils";

export const attributesQuery: Query<AttributesQuery$variables, AttributesQuery$data> = graphql`
    query AttributesQuery {
        attributes {
            id
            name
            order
            attributeType {
                id
                name
                section
            }
        }
    }
`;

export type AttributeTypeNames = "Attribute" | "Ability" | "Advantage" | "Discipline";

export type AttributeSections = "Physical" | "Social" | "Mental";

export type AttributeType = {
    +id?: string;
    +name?: ?AttributeTypeNames;
    +section?: ?AttributeSections;
};

export type Attribute = {
    +id: string;
    +name: string;
    +order: number;
    +description?: ?string;
    +attributeType?: AttributeType
};

const getAttributeTypeNameOrder = (attributeName: string) => {
    switch(attributeName) {
        case "Attribute": return 1;
        case "Ability": return 2;
        case "Advantage": return 3;
        default: return 4;
    }
};

const getAttributeTypeSectionOrder = (attributeName: string) => {
    switch(attributeName) {
        case "Physical": return 1;
        case "Social": return 2;
        default: return 3;
    }
};

const compareTypeNames = (first: string, second: string): number =>
    getAttributeTypeNameOrder(first) - getAttributeTypeNameOrder(second);

const compareTypeSection = (first: string, second: string): number =>
    getAttributeTypeSectionOrder(first) - getAttributeTypeSectionOrder(second);

export const attributesDefaultSortFunction = (first: Attribute, second: Attribute): number => {
    let result = compareTypeNames(first?.attributeType?.name ?? "", second?.attributeType?.name ?? "");

    if (result === 0) {
        result = compareTypeSection(first?.attributeType?.section ?? "", second?.attributeType?.section ?? "");
    }

    if (result === 0) {
        return first?.name > second?.name
            ? 1
            : (first?.name === second?.name ? 0 : -1);
    }

    return result;
};

const useAttributesQuery = (): ?Array<Attribute> => useCustomLazyLoadQuery(attributesQuery, emptyExactObject())
    ?.attributes
    ?.map(a => ({
        id: a?.id ?? "",
        name: a?.name ?? "",
        order: a?.order ?? 0,
        attributeType: {
            id: a?.attributeType?.id ?? "",
            name: ((a?.attributeType?.name ?? "Attribute": any): AttributeTypeNames),
            section: ((a?.attributeType?.section ?? "Physical": any): AttributeSections)
        }
    }))
    ?.sort((a, b) => attributesDefaultSortFunction(a, b))

export default useAttributesQuery;
