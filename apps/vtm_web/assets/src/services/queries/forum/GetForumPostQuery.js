// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {GetForumPostQuery$data, GetForumPostQuery$variables,} from "./__generated__/GetForumPostQuery.graphql";

export const getForumPostQuery: Query<GetForumPostQuery$variables, GetForumPostQuery$data> = graphql`
    query GetForumPostQuery($id: ID!) {
        getForumPost(id: $id) {
            id
            text
            character {
                id
                name
            }
            user {
                id
                name
            }
            onGame
        }
    }
`;
