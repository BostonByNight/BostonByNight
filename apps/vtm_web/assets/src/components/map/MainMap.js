// @flow

import React, {useEffect} from 'react';
import {convert, mainMapsQuery} from "../../services/queries/map/MainMapsQuery";
import {useCustomLazyLoadQuery} from "../../_base/relay-utils";
import {useHistory} from "react-router-dom";
import {MainRoutes} from "../MainRouter";
import MainMapWide from './MainMapWide';
import {useMediaQuery, useTheme} from '@mui/material';
import MainMapResponsive from './MainMapResponsive';
import {useRelayEnvironment} from "react-relay";
import ResetSessionMapMutation from "../../services/mutations/sessions/ResetSessionMapMutation";
import type {GenericReactComponent} from "../../_base/types";

const MainMap = (): GenericReactComponent => {
    const environment = useRelayEnvironment();
    const theme = useTheme();
    const history = useHistory();
    const ret = useCustomLazyLoadQuery(mainMapsQuery, {});
    const maps = convert(ret);
    const showResponsive = useMediaQuery(theme.breakpoints.down('sm'));

    const onMapSelected = (id: string) => history.push(MainRoutes.subMap(id));

    useEffect(() => {
        ResetSessionMapMutation(environment)
            .catch(ex => console.error("Error while updating session map", ex));
    }, [environment])

    if (showResponsive) {
        return (
            <MainMapResponsive maps={maps} onMapSelected={onMapSelected} />
        )
    }
    return (
        <MainMapWide maps={maps} onMapSelected={onMapSelected} />
    );
};

export default MainMap;
