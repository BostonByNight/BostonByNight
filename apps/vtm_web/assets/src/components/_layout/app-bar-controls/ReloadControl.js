// @flow

import React from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import {menuIconStyle} from "../menu/menu-base-utils";
import type {GenericReactComponent} from "../../../_base/types";
import MenuItem from "@mui/material/MenuItem";
const ReloadControl = (): GenericReactComponent => {
    return (
        <MenuItem onClick={_ => document.location.reload(false)} >
                <RefreshIcon sx={menuIconStyle} />
                Refresh Pagina
        </MenuItem>
    );
}

export default ReloadControl;
