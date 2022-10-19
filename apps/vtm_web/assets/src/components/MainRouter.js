// @flow

import React from "react";
import MainLayout from "./MainLayout";
import AuthRoute from "./_auth/AuthRoute";
import AuthMasterRoute from "./_auth/AuthMasterRoute";
import type {GenericReactComponent} from "../_base/types";
import AdminHavenEvents from "./admin/havens/AdminHavenEvents";

export const MainRoutes = {
    creation1: "/main/creation/1",
    creation2: "/main/creation/2",
    creation3: "/main/creation/3",
    creation4: "/main/creation/4",
    creation5: "/main/creation/5",
    creationBase: "/main/creation/",
    settings: "/main/settings",
    messages: "/main/messages",
    sentMessages: "/main/messages/sent",
    readMessage: (id: string): string => `/main/message/view/${id}`,
    newMessage: (id?: string): string => id ? `/main/message/new/${id}` : "/main/message/new",
    newMessageTo: (userId: string): string => `/main/message/new/user/${userId}`,
    newMessageToCharacter: (characterId: string): string => `/main/message/new/character/${characterId}`,
    forumSections: "/main/forum",
    forumSection: (sectionId: string): string => `/main/forum/${sectionId}`,
    forumThread: (threadId: string): string => `/main/forum/thread/${threadId}`,
    modifyForumThread: (sectionId: string, threadId: string): string => `/main/forum/${sectionId}/thread/${threadId}/modify`,
    createNewForumThread: (sectionId: string): string => `/main/forum/${sectionId}/thread/new`,
    createNewForumPost: (threadId: string): string => `/main/forum/thread/${threadId}/post/new`,
    modifyForumPost: (threadId: string, postId: string): string => `/main/forum/thread/${threadId}/post/modify/${postId}`,
    mainMap: "/main/map",
    hunt: "/main/hunt",
    havenEvents: "/main/haven-events",

    charactersList: "/main/characters",
    sheet: (id?: ?string, reload?: ?boolean): string =>
        id != null
            ? (reload === true ? `/main/sheet/${id}/reload` : `/main/sheet/${id}`)
            : "/main/character",
    modifySheet: (id: string): string => `/main/sheet/modify/${id}`,
    subMap: (id: string): string => `/main/map/${id}`,
    chat: (id: string): string => `/main/chat/${id}`,
    bookChat: "/main/book-chat",

    admin: "/main/admin",
    unapprovedCharacters: "/main/admin/unapproved",
    characterDashboard: (id: string): string => `/main/admin/character/${id}`,
    createNewNpc: "/main/admin/npc/new",
    defineNpc: (id: string): string => `/main/admin/npc/${id}/define`,
    adminHavens: "/main/admin/havens",
    chatViewer: "/main/admin/chat",
    adminHavenEvents: "/main/admin/haven-events"
}

const Main = React.lazy(() => import('./Main'));
const Creation1 = React.lazy(() => import('./creation/Creation1'));
const Creation2 = React.lazy(() => import('./creation/Creation2'));
const Creation3 = React.lazy(() => import('./creation/Creation3'));
const Creation4 = React.lazy(() => import('./creation/Creation4'));
const Creation5 = React.lazy(() => import('./creation/Creation5'));

const CharacterSheet = React.lazy(() => import('./character/CharacterSheet'));
const ModifyCharacterSheet: any = React.lazy(() => import('./character/ModifyCharacterSheet'));

const MainMap = React.lazy(() => import('./map/MainMap'));
const Map: any = React.lazy(() => import('./map/Map'));
const Chat = React.lazy(() => import('./chat/Chat'));
const BookChats = React.lazy(() => import('./chat/BookChats'));
const Hunt = React.lazy(() => import('./hunt/Hunt'));
const HavenEvents = React.lazy(() => import('./haven/HavenEvents'));

const Settings = React.lazy(() => import('./settings/Settings'));
const ReceivedMessages = React.lazy(() => import('./messages/ReceivedMessages'));
const SentMessages = React.lazy(() => import('./messages/SentMessages'));
const NewMessage: any = React.lazy(() => import('./messages/NewMessage'));
const ReadMessage: any = React.lazy(() => import('./messages/ReadMessage'));

const ForumSections = React.lazy(() => import('./forum/ForumSections'));
const CreateNewThread = React.lazy(() => import('./forum/CreateNewThread'));
const ModifyThread = React.lazy(() => import('./forum/ModifyThread'));
const ManagePost = React.lazy(() => import('./forum/forms/ManagePost'));
const ForumThread = React.lazy(() => import('./forum/ForumThread'));
const ForumSection = React.lazy(() => import('./forum/ForumSection'));

const CharactersList = React.lazy(() => import('./character/CharactersList'));
const CharacterDashboard = React.lazy(() => import('./admin/characters/CharacterDashboard'));
const UnapprovedCharacters = React.lazy(() => import('./admin/approvation/UnapprovedCharacters'));
const CreateNewNpc = React.lazy(() => import('./character/npcs/CreateNewNpc'));
const DefineNpc = React.lazy(() => import('./character/npcs/DefineNpc'));
const AdminHavens = React.lazy(() => import('./admin/havens/AdminHavens'));
const ChatViewer = React.lazy(() => import('./admin/chat/ChatViewer'));

const MainRouter = (): GenericReactComponent => {
    return (
        <MainLayout>
            <AuthRoute exact path="/main/" component={() => <Main />} />

            <AuthRoute exact path="/main/creation/1" component={() => <Creation1 />} />
            <AuthRoute exact path="/main/creation/2" component={() => <Creation2 />} />
            <AuthRoute exact path="/main/creation/3" component={() => <Creation3 />} />
            <AuthRoute exact path="/main/creation/4" component={() => <Creation4 />} />
            <AuthRoute exact path="/main/creation/5" component={() => <Creation5 />} />

            <AuthRoute exact path="/main/characters" component={() => <CharactersList />} />
            <AuthRoute exact path="/main/sheet/modify/:id" component={({match: {params: {id}}}) => <ModifyCharacterSheet id={id} />} />
            <AuthRoute exact path="/main/sheet" component={() => <CharacterSheet />} />
            <AuthRoute exact path="/main/sheet/:id/reload" component={({match: {params: {id}}}) => <CharacterSheet id={id} reload={true} />} />
            <AuthRoute exact path="/main/sheet/:id" component={({match: {params: {id}}}) => <CharacterSheet id={id} />} />

            <AuthRoute exact path="/main/map" component={() => <MainMap />} />
            <AuthRoute exact path="/main/map/:id" component={({match: {params: {id}}}) => <Map id={id} />} />
            <AuthRoute exact path="/main/chat/:id" component={({match: {params: {id}}}) => <Chat id={id} />} />
            <AuthRoute exact path="/main/book-chat" component={() => <BookChats />} />

            <AuthRoute exact path="/main/hunt" component={() => <Hunt />} />
            <AuthRoute exact path="/main/haven-events" component={() => <HavenEvents />} />

            <AuthRoute exact path="/main/settings" component={() => <Settings />} />

            <AuthRoute exact path="/main/messages/sent" component={() => <SentMessages />} />
            <AuthRoute exact path="/main/messages" component={() => <ReceivedMessages />} />
            <AuthRoute exact path="/main/message/view/:id" component={({match: {params: {id}}}) => <ReadMessage messageId={id} />} />
            <AuthRoute exact path="/main/message/new/user/:id" component={({match: {params: {id}}}) => <NewMessage toUserId={id} />} />
            <AuthRoute exact path="/main/message/new/character/:id" component={({match: {params: {id}}}) => <NewMessage toCharacterId={id} />} />
            <AuthRoute exact path="/main/message/new/:id" component={({match: {params: {id}}}) => <NewMessage replyMessageId={id} />} />
            <AuthRoute exact path="/main/message/new" component={() => <NewMessage />} />

            <AuthRoute exact path="/main/forum" component={() => <ForumSections />} />
            <AuthRoute exact path="/main/forum/:id/thread/:threadId/modify" component={({match: {params: {id, threadId}}}) =>
                <ModifyThread sectionId={id} threadId={threadId} />} />
            <AuthRoute exact path="/main/forum/:id/thread/new" component={({match: {params: {id}}}) => <CreateNewThread sectionId={id} />} />
            <AuthRoute exact path="/main/forum/thread/:threadId/post/modify/:postId" component={({match: {params: {threadId, postId}}}) =>
                <ManagePost threadId={threadId} postId={postId} />} />
            <AuthRoute exact path="/main/forum/thread/:id/post/new" component={({match: {params: {id}}}) => <ManagePost threadId={id} />} />
            <AuthRoute exact path="/main/forum/thread/:id" component={({match: {params: {id}}}) => <ForumThread threadId={id} />} />
            <AuthRoute exact path="/main/forum/:id" component={({match: {params: {id}}}) => <ForumSection sectionId={id} />} />

            <AuthMasterRoute exact path="/main/admin/character/:id" component={({match: {params: {id}}}) => <CharacterDashboard characterId={id} />} />
            <AuthMasterRoute exact path="/main/admin/unapproved" component={() => <UnapprovedCharacters />} />
            <AuthMasterRoute exact path="/main/admin/npc/new" component={() => <CreateNewNpc />} />
            <AuthMasterRoute exact path="/main/admin/npc/:id/define" component={({match: {params: {id}}}) => <DefineNpc characterId={id} />} />
            <AuthMasterRoute exact path="/main/admin/havens" component={() => <AdminHavens />} />
            <AuthMasterRoute exact path="/main/admin/chat" component={() => <ChatViewer />} />
            <AuthMasterRoute exact path='/main/admin/haven-events' component={() => <AdminHavenEvents />} />
        </MainLayout>
    );
}

export default MainRouter;
