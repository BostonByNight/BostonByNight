// @flow

import graphql from 'babel-plugin-relay/macro';
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import type {
    GetCharacterStatsQuery$data,
    GetCharacterStatsQuery$variables,
} from "./__generated__/GetCharacterStatsQuery.graphql";
import type {AttributeTypeNames} from "../info/AttributesQuery";
import {sortStrings} from "../../../_base/info-helpers";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export const getCharacterStatsQuery: Query<GetCharacterStatsQuery$variables, GetCharacterStatsQuery$data> = graphql`
    query GetCharacterStatsQuery($id: ID!) {
        getCharacterStats(characterId: $id) {
            id
            attributes {
                id
                value
                attribute {
                    name
                    attributeType {
                        name
                        section
                    }
                }
            }
            disciplines {
                id
                value
                attribute {
                    name
                }
            }
            advantages {
                id
                value
                attribute {
                    name
                }
            }
            predatorType {
                id
                name
                description
            }
        }
    }
`;

export type StatWithoutId = {
    name: ?string;
    value: ?number;
    maxValue?: number;
    color?: string;
};

export type Stat = StatWithoutId & {
    id: ?string;
};

export type Attribute = Stat & {
    type: ?string;
    section: ?string;
};

type CharacterAttributeSorterFunction = (?Attribute, ?Attribute) => number;

export const characterAttributeSorter = (type: AttributeTypeNames): CharacterAttributeSorterFunction =>
    (a: ?Attribute, b: ?Attribute): number => {
        if (a?.section != null && b?.section != null && a.section !== b.section) {
            return sortStrings(a.section, b.section);
        }

        if (type === "Attribute" && a?.id != null && b?.id != null) {
            return sortStrings(a.id, b.id);
        }
        else if (a?.name != null && b?.name != null) {
            return sortStrings(a.name, b.name);
        }

        return 0;
    }

export type Discipline = Stat;

export type Advantage = Stat;

export type PredatorType = {
    id?: ?string;
    name: ?string;
    description: ?string;
};

export type CharacterStats = {|
    characterId: string;
    attributes: Array<Attribute>;
    disciplines: Array<Discipline>;
    advantages: Array<Advantage>;
    predatorType: PredatorType
|};

export const useCharacterStatsQuery = (characterId: string, queryOptions?: any): ?CharacterStats => {
    const s =
        useCustomLazyLoadQuery(getCharacterStatsQuery, {id: characterId}, queryOptions ?? {
            fetchPolicy: "store-and-network"
        })
            ?.getCharacterStats;

    if (s?.id != null) {
        return ({
            characterId: s.id,
            attributes: s?.attributes
                ?.map(a => ({
                    id: a?.id,
                    name: a?.attribute?.name,
                    type: a?.attribute?.attributeType?.name,
                    section: a?.attribute?.attributeType?.section,
                    value: a?.value
                })) ?? [],
            disciplines: s?.disciplines?.map(a => ({
                id: a?.id,
                name: a?.attribute?.name,
                value: a?.value
            })) ?? [],
            advantages: (s?.advantages ?? [])?.map(a => ({
                id: a?.id,
                name: a?.attribute?.name,
                value: a?.value
            })),
            predatorType: {
                id: s?.predatorType?.id,
                name: s?.predatorType?.name,
                description: s?.predatorType?.description
            }
        });
    }

    return null;
}
