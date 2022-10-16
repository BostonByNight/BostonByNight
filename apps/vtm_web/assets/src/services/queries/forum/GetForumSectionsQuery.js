// @flow

import graphql from 'babel-plugin-relay/macro';
import type {
    GetForumSectionsQuery$data,
    GetForumSectionsQuery$variables,
} from "./__generated__/GetForumSectionsQuery.graphql";
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import {emptyExactObject} from "../../../_base/utils";

export const getForumSectionsQuery: Query<GetForumSectionsQuery$variables, GetForumSectionsQuery$data> = graphql`
    query GetForumSectionsQuery {
        getForumSections {
            section {
                id
                title
                description
                onGame
                canView
                canEdit
                orderType
                insertedAt
                updatedAt
            }
            lastThread {
                id
                title
                updatedAt
            }
            hasNewPosts
        }
    }
`;

const useForumSections = (): GetForumSectionsQuery$data =>
    useCustomLazyLoadQuery(getForumSectionsQuery, emptyExactObject(), {
        // store and network for checking new messages notifications
        fetchPolicy: "store-and-network"
    });

export default useForumSections;
