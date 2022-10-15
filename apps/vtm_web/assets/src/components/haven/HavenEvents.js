// @flow

import React from "react";
import {useCustomLazyLoadQuery} from "../../_base/relay-utils";
import {getCharacterHavenEventsQuery} from "../../services/queries/haven/GetCharacterHavenEventsQuery";
import type {HavenEventsInternalProps} from "./HavenEventsListWrapper";
import HavenEventsListWrapper from "./HavenEventsListWrapper";
import Stack from "@mui/material/Stack";

const HavenEventsInternal = ({characterId, fetchKey, component}: HavenEventsInternalProps) => {
    const events = useCustomLazyLoadQuery(getCharacterHavenEventsQuery, {
        characterId: characterId
    }, {
        fetchPolicy: "network-only",
        fetchKey: fetchKey
    })?.getCharacterDomainEvents?.result;

    return component(events);
};

const HavenEvents = (): any => {
    return (
        <Stack direction="column">
            <h1 >
                Eventi nel Dominio del personaggio
            </h1>

            <HavenEventsListWrapper component={HavenEventsInternal} />
        </Stack>
    );
};

export default HavenEvents;
