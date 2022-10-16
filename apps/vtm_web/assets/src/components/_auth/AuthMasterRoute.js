// @flow

import React from "react";
import {Redirect, Route} from "react-router-dom";
import {Routes} from "../../AppRouter";
import type {GenericReactComponent} from "../../_base/types";
import {useRecoilValue} from "recoil";
import {sessionStateAtom} from "../../session/atoms";
import {RouteComponentProps} from "react-router-dom";

type Props = {
    component?: (...any) => any;
    children?: any;
}

const AuthMasterRoute = ({ children, component, ...rest }: Props): GenericReactComponent => {
    const user = useRecoilValue(sessionStateAtom);

    const loginRedirection = (location: string) => ({
        pathname: Routes.map,
        state: { from: location }
    });

    const render = (historyData: any) => {
        const {location} = historyData;
        return user?.id != null && user?.role === "MASTER"
            ? children || component?.(historyData)
            : (<Redirect to={loginRedirection(location)}/>);
    }

    return (
        <Route {...rest} render={render} />
    )
}

export default AuthMasterRoute;
