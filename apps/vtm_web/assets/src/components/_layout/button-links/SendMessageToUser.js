// @flow

import React from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MessageIcon from "@mui/icons-material/Message";
import {menuIconStyle} from "../menu/menu-base-utils";
import {MainRoutes} from "../../MainRouter";
import {useHistory} from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import {iconButtonSize} from "./constants";
import type {GenericReactComponent} from "../../../_base/types";

type Props = {
    userId: ?string;
    onSelected?: () => void;
    asMenuItem?: boolean;
}

const SendMessageToUser = ({userId, onSelected, asMenuItem}: Props): GenericReactComponent => {
    const history = useHistory();

    const trySendMessageToUser = (_: any) => {
        if (userId != null) {
            history.push(MainRoutes.newMessageTo(userId));
        }
        else {
            history.push(MainRoutes.newMessage());
        }

        if (onSelected != null) {
            onSelected();
        }
    };

    if (asMenuItem === true) {
        return (
            <MenuItem onClick={trySendMessageToUser}>
                <ListItemIcon>
                    <MessageIcon />
                </ListItemIcon>
                Inva messaggio all'utente
            </MenuItem>
        );
    }

    return (
        <Tooltip title="Invia messaggio all'utente">
            <IconButton aria-label="Messaggio"
                        size={iconButtonSize}
                        onClick={trySendMessageToUser}>
                <MessageIcon sx={menuIconStyle} />
            </IconButton>
        </Tooltip>
    );
}

export default SendMessageToUser;
