// @flow

import type {GenericReactComponent} from "./_base/types";
import React from "react";
import {Route, Switch} from "react-router-dom";

export type OpenDialogDelegate = (title: string, text: string, onOk: () => void, onCancel: ?() => void) => void;

export const Routes = {
    map: "/main/map",
    splashScreen: "/",
    main: "/main",
    guideMain: "/guides",
    logout: "/logout",
    sessionExpired: "/session-expired"
};

const SplashScreen = React.lazy(() => import('./components/login/SplashScreen'));

const LoginRouter = React.lazy(() => import('./components/login/LoginRouter'));
const MainRouter = React.lazy(() => import('./components/MainRouter'));
const GuidesMain = React.lazy(() => import('./components/guides/GuidesMain'));
const Logout = React.lazy(() => import('./components/logout/Logout'));

const AppRouter = (): GenericReactComponent => {
    return (
        <Switch>
            <Route exact path="/" component={SplashScreen} />
            <Route exact path="/logout" component={() => <Logout title="Logout effettuato con successo" />} />
            <Route exact path="/session-expired" component={() => <Logout title="Sessione Scaduta!" />} />
            <Route path="/access" component={LoginRouter} />
            <Route path="/main" component={MainRouter} />
            <Route path="/guides" component={GuidesMain} />
        </Switch>
    );
};

export default AppRouter;
