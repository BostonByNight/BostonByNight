// @flow

import React from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EmailIcon from '@mui/icons-material/Email';
import {menuIconStyle} from "../menu/menu-base-utils";
import {MainRoutes} from "../../MainRouter";
import {useHistory} from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import {iconButtonSize} from "./constants";
import type {GenericReactComponent} from "../../../_base/types";

type Props = {
    characterId: ?string;
    onSelected?: () => void;
    asMenuItem?: boolean;
}

const SendMessageToCharacter = ({characterId, onSelected, asMenuItem}: Props): GenericReactComponent => {
    const history = useHistory();

    const trySendMessageToCharacter = (_: any) => {
        if (characterId != null) {
            history.push(MainRoutes.newMessageToCharacter(characterId));
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
            <MenuItem onClick={trySendMessageToCharacter}>
                <ListItemIcon>
                    <EmailIcon />
                </ListItemIcon>
                Inva messaggio al personaggio
            </MenuItem>
        );
    }

    return (
        <Tooltip title="Invia messaggio al personaggio">
            <IconButton aria-label="Messaggio"
                        size={iconButtonSize}
                        onClick={trySendMessageToCharacter}>
                <EmailIcon sx={menuIconStyle} />
            </IconButton>
        </Tooltip>
    );
}

export default SendMessageToCharacter;
