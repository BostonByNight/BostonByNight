// @flow

import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import SetNewPassword from "./SetNewPassword";
import ToggleVisible from "./ToggleVisible";
import {useRecoilValue} from "recoil";
import {isUserMasterSelector} from "../../session/selectors";
import type {GenericReactComponent} from "../../_base/types";

const Settings = (): GenericReactComponent => {
    const isUserMaster = useRecoilValue(isUserMasterSelector)

    const toggleVisibleControl = () =>
        isUserMaster
            ? (
                <Grid item xs={12}>
                    <ToggleVisible />
                </Grid>
            )
            : (<React.Fragment />);

    return (
        <Container>
            <Grid container>
                <Grid item xs={12}>
                    <SetNewPassword />
                </Grid>
                {toggleVisibleControl()}
            </Grid>
        </Container>
    );
}

export default Settings;
