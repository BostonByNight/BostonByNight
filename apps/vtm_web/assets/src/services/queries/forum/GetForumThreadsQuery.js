// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    GetForumThreadsQuery$data,
    GetForumThreadsQuery$variables,
} from "./__generated__/GetForumThreadsQuery.graphql";

export const getForumThreadsQuery: Query<GetForumThreadsQuery$variables, GetForumThreadsQuery$data> = graphql`
    query GetForumThreadsQuery($forumSectionId: ID!, $pageSize: Int!, $page: Int!, $characterId: ID) {
        getForumThreads(forumSectionId: $forumSectionId, pageSize: $pageSize, page: $page, characterId: $characterId) {
            threadCount
            threads {
                thread {
                    id
                    forumSection {
                        id
                    }
                    creatorUser {
                        id
                        name
                    }
                    creatorCharacter {
                        id
                        name
                    }
                    title
                    description
                    highlighted
                    insertedAt
                    updatedAt
                }
                lastPostUpdatedAt
                hasNewPosts
            }
        }
    }
`;
