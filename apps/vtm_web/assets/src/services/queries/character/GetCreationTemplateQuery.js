// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    GetCreationTemplateQuery$data,
    GetCreationTemplateQuery$variables,
} from "./__generated__/GetCreationTemplateQuery.graphql";

export const getCreationTemplateQuery: Query<GetCreationTemplateQuery$variables, GetCreationTemplateQuery$data> = graphql`
    query GetCreationTemplateQuery {
        getCreationTemplates {
            id
            name
            description
        }
    }
`;
