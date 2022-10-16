// @flow

import graphql from 'babel-plugin-relay/macro';
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import type {
    IsCharacterAwakeQuery$data,
    IsCharacterAwakeQuery$variables,
} from "./__generated__/IsCharacterAwakeQuery.graphql";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";

export const isCharacterAwakeQuery: Query<IsCharacterAwakeQuery$variables, IsCharacterAwakeQuery$data> = graphql`
    query IsCharacterAwakeQuery($characterId: ID!) {
        isCharacterAwake(characterId: $characterId)
    }
`;

export const useIsCharacterAwake = (characterId: string, fetchKey: number): boolean =>
    useCustomLazyLoadQuery(isCharacterAwakeQuery, {characterId}, {
        fetchPolicy: "network-only",
        fetchKey: fetchKey
    })?.isCharacterAwake === true;
