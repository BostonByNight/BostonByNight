// @flow

import React from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import RoomIcon from '@mui/icons-material/Room';
import {menuIconStyle} from "../menu/menu-base-utils";
import {useHistory} from "react-router-dom";
import {MainRoutes} from "../../MainRouter";
import type {GenericReactComponent} from "../../../_base/types";
import {useRecoilValue} from "recoil";
import {sessionMapStateAtom} from "../../../session/atoms";

const ReturnToChatControl = (): GenericReactComponent => {
    const history = useHistory();
    const location = useRecoilValue(sessionMapStateAtom)

    const tryGoToChat = (locationId: ?string) =>
        (_: any) => {
            if (locationId != null) {
                history.push(MainRoutes.chat(locationId));
            }
        }

    const title = () => {
        const common = "Torna all'ultima Chat";

        if (location?.name != null) {
            return `${common} (${location.name})`;
        }

        return common;
    }

    if (location?.id != null) {
        return (
            <Tooltip title={title()}>
                <IconButton aria-label="Chat"
                            size="large"
                            onClick={tryGoToChat(location.id)}>
                    <RoomIcon sx={menuIconStyle} />
                </IconButton>
            </Tooltip>
        );
    }

    return (<></>);
}

export default ReturnToChatControl;
