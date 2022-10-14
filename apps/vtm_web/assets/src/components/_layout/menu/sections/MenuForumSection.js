// @flow

import React from "react";
import {MainRoutes} from "../../../MainRouter";
import ChatIcon from "@mui/icons-material/Chat";
import type {GenericReactComponent} from "../../../../_base/types";
import MenuItem from "@mui/material/MenuItem";
import {useHistory} from "react-router-dom";

const MenuForumSection = ({menuStyle}): GenericReactComponent => {
    const history = useHistory();

    return (
        <MenuItem button onClick={() => history.push(MainRoutes.forumSections)}>
            <ChatIcon sx={menuStyle} />
            Forum
        </MenuItem>
    );
}

export default MenuForumSection;
