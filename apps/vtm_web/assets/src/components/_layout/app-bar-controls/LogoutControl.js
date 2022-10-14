// @flow

import React from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {useHistory} from "react-router-dom";
import {performLogout} from "../../../services/logout-service";
import {menuIconStyle} from "../menu/menu-base-utils";
import {Routes} from "../../../AppRouter";
import type {GenericReactComponent} from "../../../_base/types";
import {useDialog} from "../../../_base/providers/DialogProvider";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

const LogoutControl = (): GenericReactComponent => {
    const history = useHistory();
    const {showDialog} = useDialog()

    const logoutClick = _ => {
        showDialog("Logout", "Vuoi uscire dal gioco?", () =>
            performLogout(() => history.push(Routes.logout)));
    }

    return (
        <MenuItem button  onClick={logoutClick}>
                <ExitToAppIcon sx={menuIconStyle} />
                Logout
        </MenuItem>
    );
}

export default LogoutControl;
