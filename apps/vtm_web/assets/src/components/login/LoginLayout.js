// @flow

import type {Node} from "react";
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import NoCookieBar from "../../_base/components/NoCookieBar";
import {useTheme} from "@mui/material/styles";
import {useMediaQuery} from "@mui/material";
import Box from "@mui/material/Box";
import BbnLogoComponent from "../_layout/menu/BbnLogoComponent";

export type HomeLayoutProps = {
    title: string;
    icon: any;
}

type LoginLayoutProps = HomeLayoutProps & {
    children: Node;
}

const LoginLayout = (props: LoginLayoutProps): Node => {
    const theme = useTheme();
    // const classes = useStyles();

    const isPhone = useMediaQuery(theme.breakpoints.down("sm"));

    const loginFrameBackgroundColor = isPhone
        ? "#191919EE"
        // : "linear-gradient(to right, #191919EE, #191919)"
        : "transparent"
    ;

    return (
        <Grid container component="main" sx={{
            height: '100vh',
            backgroundColor: "black",
            backgroundSize: {
                xs: "cover",
                sm: "auto 100vh"
            },
            backgroundPosition: {
                xs: 'top center',
                sm: 'left top',
            },
            // backgroundBlendMode: "hard-light"
        }}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7}>
                <Box sx={{
                    position: "absolute",
                    zIndex: "3",
                    bottom: "2rem",
                    width: "100%"
                }}>
                    <Grid item xs={false} md={12} lg={7}>
                        <BbnLogoComponent  primaryRem="7rem" secondaryRem="4rem" addStyle={{
                                textShadow: "1px 1px black",
                                textAlign: "center",
                                marginLeft: {
                                    sm: "5rem",
                                    md: "7rem",
                                    lg: "9rem"
                                }
                        }} />
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{
                background: loginFrameBackgroundColor,
                overflow: "auto",
                height: "100vh",
                zIndex: "4"
            }}>
                <div style={{
                    margin: theme.spacing(8, 4),
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    {props.children}
                </div>
            </Grid>
            <NoCookieBar />
        </Grid>
    );
}

export default LoginLayout;
