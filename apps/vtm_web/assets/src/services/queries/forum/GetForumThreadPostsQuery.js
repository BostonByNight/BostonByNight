// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    GetForumThreadPostsQuery$data,
    GetForumThreadPostsQuery$variables,
} from "./__generated__/GetForumThreadPostsQuery.graphql";

// This redundant type definition is due to the fact that the auto-generated query doesn't extract the type of the post,
// but rather it represent the post type directly in the array definition.
export type Post = {|
    +id: string,
    +text: ?string,
    +character: ?{|
        +id: string,
        +name: ?string,
    |},
    +user: ?{|
        +id: string,
        +name: ?string,
    |},
    +onGame: ?boolean,
    +insertedAt: ?any,
    +updatedAt: ?any,
|};

export const getForumThreadPostsQuery: Query<GetForumThreadPostsQuery$variables, GetForumThreadPostsQuery$data> = graphql`
    query GetForumThreadPostsQuery($forumThreadId: ID!, $pageSize: Int!, $page: Int!) {
        getForumThreadPosts(id: $forumThreadId, pageSize: $pageSize, page: $page) {
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
            insertedAt
            updatedAt
        }
    }
`;
