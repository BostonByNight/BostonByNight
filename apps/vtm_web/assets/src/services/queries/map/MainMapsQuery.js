// @flow

import graphql from "babel-plugin-relay/macro";
import {convertToJavascriptArray} from "../../../_base/relay-utils";
import {convertToMap} from "../../base-types";
import {emptyArray} from "../../../_base/utils";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {MainMapsQuery$data, MainMapsQuery$variables,} from "./__generated__/MainMapsQuery.graphql";

export const mainMapsQuery: Query<MainMapsQuery$variables, MainMapsQuery$data> = graphql`
    query MainMapsQuery {
        mainMaps {
            id
            name
            description
            children {
                id
                name
            }
        }
    }
`;

export const convert: any => any = result => {
    return convertToJavascriptArray(result?.mainMaps).map(convertToMap) ?? emptyArray();
};
