// @flow

import React, {useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {Routes} from "../../AppRouter";
import CenteredBox from "../../_base/components/CenteredBox";
import {LoginRoutes} from "./LoginRouter";
import type {GenericReactComponent} from "../../_base/types";
import {useRecoilValue} from "recoil";
import {sessionStateAtom} from "../../session/atoms";
import {useHistory} from "react-router-dom";

const SplashScreen = (): GenericReactComponent => {
    const history = useHistory();
    const user = useRecoilValue(sessionStateAtom)

    useEffect(() => {
        if (user?.id != null) {
            history.push(Routes.map);
        }
        else {
            history.push(LoginRoutes.login);
        }
    });

    const handleLogoClick = () => history.push(LoginRoutes.login);

    return (
        <Box onClick={_ => handleLogoClick()}>
            <CenteredBox innerBoxSx={{
                maxWidth: "237px",
                height: "70vh",
                background: `url("/Camarilla.webp") no-repeat`}} isBodyChild={true}>
                <CenteredBox isBodyChild={false}>
                    <Typography sx={{
                        fontFamily: 'DefaultTypewriter',
                        color: "#C92929",
                        fontSize: "24px",
                        textAlign: "center",
                        fontWeight: "bold",
                        textShadow: "2px 2px black, -2px 2px black"
                    }}>
                        Buenos Aires by Night<br />
                        <br />
                        Clicca per accedere
                    </Typography>
                </CenteredBox>
            </CenteredBox>
        </Box>
    )
};

export default SplashScreen;
