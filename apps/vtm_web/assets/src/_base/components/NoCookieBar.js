// @flow

import React, {useState} from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CookieFreePolicy from "./CookieFreePolicy";
import {useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {menuIconStyle} from "../../components/_layout/menu/menu-base-utils";
import type {GenericReactComponent} from "../types";

const NoCookieBar = (): GenericReactComponent => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("md"));

    const [showCookiePolicy, setShowCookiePolicy] = useState(true);

    const cookieHeight = isSmall ? "100px" : "61px";

    const onCookieCloseClick = (_: any) => {
        setShowCookiePolicy(false);
    }

    if (showCookiePolicy) {
        return (
            <Box sx={{
                zIndex: "10",
                position: "fixed",
                left: "0px",
                top: "0px",
                width: "100%",
                height: cookieHeight,
                backgroundColor: "black",
                color: "white",
                opacity: "0.7"
            }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onCookieCloseClick}
                        aria-label="close">
                        <CloseIcon sx={menuIconStyle} />
                    </IconButton>
                    <CookieFreePolicy/>
                </Toolbar>
            </Box>
        );
    }

    return (<></>);
}

export default NoCookieBar;
