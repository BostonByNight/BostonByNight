// @flow

import React from "react";
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import {getHavenUnresolvedEventsQuery} from "../../../services/queries/haven/GetHavenUnresolvedEventsQuery";
import {HavenEventsListWrapper} from "../../haven/HavenEventsListWrapper";
import Stack from "@mui/material/Stack";
import {emptyExactObject} from "../../../_base/utils";
import type {GenericReactComponent} from "../../../_base/types";

type AdminHavenEventsInternalProps = {
    fetchKey: number,
    component: GenericReactComponent
}

const AdminHavenEventsInternal = ({fetchKey, component}: AdminHavenEventsInternalProps): GenericReactComponent => {
    const events = useCustomLazyLoadQuery(getHavenUnresolvedEventsQuery, emptyExactObject(), {
        fetchPolicy: "network-only",
        fetchKey: fetchKey
    })?.getUnresolvedEvents?.result;

    return component(events);
}

const AdminHavenEvents = (): any => {
    return (
        <Stack direction="column">
            <h1 >
                Eventi nel Dominio
            </h1>

            <HavenEventsListWrapper isMaster
                                    component={AdminHavenEventsInternal} />
        </Stack>
    );
};

export default AdminHavenEvents;
