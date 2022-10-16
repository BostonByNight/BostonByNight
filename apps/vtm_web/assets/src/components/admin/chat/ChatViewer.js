// @flow

import Grid from "@mui/material/Grid";
import React, {useState} from "react";
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import {getAllChatLocationsQuery} from "../../../services/queries/chat/GetAllChatLocationsQuery";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {getAdminChatEntriesQuery} from "../../../services/queries/chat/GetAdminChatEntriesQuery";
import {defaultFormatDateAndTimeForControl, parseISO, yesterday} from "../../../_base/date-utils";
import ParsedText from "../../../_base/components/ParsedText";
import type {GenericReactComponent} from "../../../_base/types";
import {emptyExactObject} from "../../../_base/utils";

type ChatViewerInternalProps = {
    from: any,
    to: any,
    mapId: string,
    fetchKey: number
}

const ChatViewer = (): GenericReactComponent => {
    const chatRooms = useCustomLazyLoadQuery(getAllChatLocationsQuery, emptyExactObject())
        ?.allChatLocations;

    const [from, setFrom] = useState(yesterday(new Date()));
    const [to, setTo] = useState(new Date());
    const [selectedChatId, setSelectedChatId] = useState("");
    const [fetchKey, setFetchKey] = useState(0);

    const formattedFromDate = () => defaultFormatDateAndTimeForControl(from);
    const formattedToDate = () => defaultFormatDateAndTimeForControl(to);

    const showAllChatRooms = () => {
        const def = [<MenuItem key={-1} id="">None</MenuItem>];

        if (chatRooms != null && chatRooms.length > 0) {
            const roomItems = chatRooms
                .map(val => (<MenuItem key={val?.id} value={val?.id}>{val?.name}</MenuItem>));
            
            return def.concat(roomItems);
        }

        return def;
    }

    const handleFromChange = ({target: {value: newValue}}) => {
        setFrom(_ => parseISO(newValue));
        setFetchKey(k => k + 1);
    };

    const handleToChange = ({target: {value: newValue}}) => {
        setTo(_ => parseISO(newValue));
        setFetchKey(k => k + 1);
    };

    const handleChatRoomChange = ({target: {value}}: GenericEvent) => {
        setSelectedChatId(_ => value);
        setFetchKey(k => k + 1);
    };

    const showRows = () => {
        if (selectedChatId != null && selectedChatId !== "") {
            return (<ChatViewerInternal mapId={selectedChatId}
                                        from={from}
                                        to={to}
                                        fetchKey={fetchKey} />);
        }

        return (<></>);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container>
                <Grid item xs={12} sm={6} md={4} sx={{textAlign: "center"}}>
                    <TextField id="from"
                               label="Da"
                               type="datetime-local"
                               defaultValue={formattedFromDate()}
                               onChange={handleFromChange}
                               sx={{ width: 250 }}
                               InputLabelProps={{
                                   shrink: true,
                               }} />
                </Grid>
                <Grid item xs={12} sm={6} md={4} sx={{textAlign: "center"}}>
                    <TextField id="to"
                               label="Fino a"
                               type="datetime-local"
                               defaultValue={formattedToDate()}
                               onChange={handleToChange}
                               sx={{ width: 250 }}
                               InputLabelProps={{
                                   shrink: true,
                               }} />
                </Grid>
                <Grid item xs={12} md={4} sx={{textAlign: "center"}}>
                    <FormControl fullWidth>
                        <InputLabel id="chat-room">Chat</InputLabel>
                        <Select labelId="chat-room"
                                id="chat-room-select"
                                value={selectedChatId}
                                label="Age"
                                onChange={handleChatRoomChange}>
                            {showAllChatRooms()}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sx={{
                    margin: "20px",
                    padding: "20px"
                }}>
                    {showRows()}
                </Grid>
            </Grid>
        </LocalizationProvider>
    );
};

const ChatViewerInternal = ({from, to, mapId, fetchKey}: ChatViewerInternalProps) => {
    const entries = useCustomLazyLoadQuery(getAdminChatEntriesQuery, {
        mapId: mapId, 
        fromDate: from, 
        toDate: to
    }, {
        fetchPolicy: "network-only",
        fetchKey: fetchKey
    });

    const rows = () => entries
        ?.mapAdminChatEntries
        ?.map(entry => (
            <TableRow key={entry?.id}
                      sx={{
                          '&:last-child td, &:last-child th': {
                              border: 0
                          }
                      }}>
                <TableCell component="th" scope="row" sx={{verticalAlign: "top"}}>
                    <ParsedText text={entry?.insertedAt} internalDivSx={{
                        fontSize: "0.9rem"
                    }} />
                </TableCell>
                <TableCell sx={{verticalAlign: "top"}}>
                    <ParsedText text={entry?.character?.name} internalDivSx={{
                        fontSize: "0.9rem"
                    }} />
                </TableCell>
                <TableCell>
                    <ParsedText text={entry?.text ?? entry?.result} internalDivSx={{
                        fontSize: "0.9rem"
                    }} />
                </TableCell>
            </TableRow>
        ));

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="chat-logs">
                <TableHead>
                    <TableRow>
                        <TableCell>Ora</TableCell>
                        <TableCell>Personaggio</TableCell>
                        <TableCell>Testo</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows()}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ChatViewer;
