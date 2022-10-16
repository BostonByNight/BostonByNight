// @flow

import React from "react";
import MeetingRoomTwoToneIcon from "@mui/icons-material/MeetingRoomTwoTone";
import {menuIconStyle} from "../_layout/menu/menu-base-utils";
import ReportProblemTwoToneIcon from "@mui/icons-material/ReportProblemTwoTone";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";
import ListItemText from "@mui/material/ListItemText";
import {defaultFormatDate, sortByDate} from "../../_base/date-utils";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import type {HavenEvent} from "../../services/queries/haven/HavenEventFragment";
import {castNotNull, toArray} from "../../_base/utils";
import type {Haven} from "../../services/queries/haven/GetHavensQuery";
import type {Character} from "../../services/queries/character/GetCharacterCompleteQuery";

const getTooltipFromEvent = ({controlTriggered}: {controlTriggered: boolean}) =>
    controlTriggered
        ? "Intrusione"
        : "Attenzione richiamata";

const getTitleFromEvent = (isMaster: boolean, {controlTriggered, character, haven}: {
    controlTriggered: boolean,
    character: Character,
    haven: Haven
}) =>
    isMaster
        ? (controlTriggered
            ? `${character?.name ?? ""} è entrato nel tuo dominio di ${haven?.character?.name ?? ""} per cacciare`
            : `${character?.name ?? ""} è stato intercettato nel Dominio di ${haven?.character?.name ?? ""}`)
        : (controlTriggered
            ? `${character?.name ?? "Qualcuno"} è entrato nel tuo dominio per cacciare`
            : `${character?.name ?? "Qualcuno"} è stato intercettato nel tuo Dominio`);

const actions = ({id}: {id: string}, onClick: string => void) => {
    return (
        <Button onClick={_ => onClick(id)}>
            Ignora / Risolto
        </Button>);
};

const EventListItem = ({isMaster, e, resolveEvent}: {
    isMaster: boolean,
    e: any,
    resolveEvent: string => void
}) => {
    const tooltipText = getTooltipFromEvent(e);
    const eventIcon = React.useMemo(() => (
        <Tooltip title={tooltipText}>
            {
                e.controlTriggered
                    ? (<MeetingRoomTwoToneIcon sx={menuIconStyle}/>)
                    : (<ReportProblemTwoToneIcon sx={menuIconStyle}/>)
            }
        </Tooltip>
    ), [e, tooltipText]);

    if (e != null) {
        return (
            <>
                <ListItem disablePadding secondaryAction={actions(e, resolveEvent)}>
                    <ListItemButton>
                        <ListItemIcon>
                            {eventIcon}
                        </ListItemIcon>
                        <ListItemText primary={getTitleFromEvent(isMaster, e)}
                                      secondary={defaultFormatDate(e?.insertedAt)} />
                    </ListItemButton>
                </ListItem>
                <Divider/>
            </>
        );
    }

    return (<></>);
};

type Props = {
    isMaster: boolean;
    events: ?$ReadOnlyArray<?HavenEvent>;
    resolveEvent: string => void;
}

const HavenEventsList = ({isMaster, events, resolveEvent}: Props): any => {
    const rows = () => {
        const es = toArray(events);

        if (es != null && es.length > 0) {
            return es
                .filter(es => es != null)
                .map(e => castNotNull(e))
                .sort(({updatedAt: a}, {updatedAt: b}) => sortByDate(a ?? "", b ?? "", true))
                .map(e => (
                    <EventListItem key={e.id} isMaster={isMaster} e={e} resolveEvent={resolveEvent} />
                )) ?? [];
        }

        return (<></>);
    }

    return (
        <Box sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center"
        }}>
            <List sx={{
                width: {
                    sx: "100%",
                    md: "100%"
                },
                bgcolor: 'background.paper',
            }}>
                {rows()}
            </List>
        </Box>
    );
}

export default HavenEventsList;
