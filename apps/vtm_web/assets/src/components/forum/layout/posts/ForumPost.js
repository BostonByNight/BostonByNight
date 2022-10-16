// @flow

import React from "react";
import type {Post} from "../../../../services/queries/forum/GetForumThreadPostsQuery";
import type {GenericReactComponent} from "../../../../_base/types";
import ForumPostOffGame from "./ForumPostOffGame";
import ForumPostOnGame from "./ForumPostOnGame";
import ForumPostLayout from "./ForumPostLayout";

type Props = {
    threadId: string;
    onGame: boolean;
    post: ?Post;
    onReload: () => void;
}

const ForumPost = ({threadId, onGame, post, onReload}: Props): GenericReactComponent => {
    return (
        <ForumPostLayout key={post?.id} post={post} threadId={threadId} onReload={onReload}>
            <ForumPostInternal post={post} onGame={onGame} />
        </ForumPostLayout>
    );
};

const ForumPostInternal = ({post, onGame}: {
    post: ?Post,
    onGame: boolean
}) => {
    if (post?.onGame) {
        return (
            <ForumPostOnGame post={post}
                             onGame={onGame} />
        );
    }
    else {
        return (
            <ForumPostOffGame post={post}
                              onGame={onGame}/>
        );
    }
}

export default ForumPost;
