// @flow

import React, {useState} from "react";
import {useCustomLazyLoadQuery} from "../../_base/relay-utils";
import {DefaultPageSize} from "./ForumThread";
import {getForumThreadPostsQuery} from "../../services/queries/forum/GetForumThreadPostsQuery";
import type {GenericReactComponent} from "../../_base/types";
import ForumPost from "./layout/posts/ForumPost";

type Props = {
    threadId: string;
    page: number;
}

type Post = ?{|
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
|}


const ForumThreadPage = ({threadId, page}: Props): GenericReactComponent => {
    const [postFetchKey, setPostFetchKey] = useState(0);

    const onReloadCustom = () => {
        setPostFetchKey(p => p + 1);
    }

    const posts = useCustomLazyLoadQuery(getForumThreadPostsQuery, {
        forumThreadId: threadId,
        pageSize: DefaultPageSize,
        page: page
    }, {
        fetchPolicy: "store-and-network",
        fetchKey: postFetchKey
    })?.getForumThreadPosts;

    const showThreadPost = (post: Post) => (
        <ForumPost key={post?.id}
                   post={post}
                   threadId={threadId}
                   onGame={post?.onGame === true}
                   onReload={onReloadCustom} />
    );

    const showThreadPosts = () =>
        posts?.map(showThreadPost);

    return showThreadPosts();
}

export default ForumThreadPage;
