// @flow

import type {Node} from 'react';
import React, {createRef, Suspense, useState} from "react";
import {RelayEnvironmentProvider} from 'react-relay';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import AppRouter, {Routes} from "./AppRouter";
import {SnackbarProvider} from "notistack";
import {ErrorBoundaryWithRetry} from "./_base/components/ErrorBoundaryWithRetry";
import FallbackComponent from "./components/FallbackComponent";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";
import {useEnv} from "./_base/relay-environment";
import type {IEnvironment} from "relay-runtime";
import MainSuspenseFallback from "./MainSuspenseFallback";
import {performLogout} from "./services/logout-service";
import type {GenericReactComponent} from "./_base/types";
import {RecoilRoot} from "recoil";
import BackdropProvider from "./_base/providers/BackdropProvider";
import DialogProvider from "./_base/providers/DialogProvider";
import {useCustomSnackbar} from "./_base/notification-utils";

const Internal = ({env}: { env: IEnvironment}) => {
    const {enqueueSnackbar} = useCustomSnackbar()
    const history = useHistory()

    const fallback = (error, _retry): GenericReactComponent => {
        console.error("An unhandled error happened in the app", error)

        enqueueSnackbar({
            type: "error",
            message: "There was an error in the application"
        })

        return (
            <FallbackComponent error={error} retry={_retry} />
        )
    };

    return (
        <ErrorBoundaryWithRetry fallback={fallback}
                                onUnauthorized={() => performLogout(() => history.push(Routes.sessionExpired))}>
            <RelayEnvironmentProvider environment={env}>
                <AppRouter />
            </RelayEnvironmentProvider>
        </ErrorBoundaryWithRetry>);
}

const App = (): Node => {
    const darkState = useState(true);
    const paletteType = darkState ? "dark" : "light";
    const environment = useEnv();

    const darkTheme = createTheme({
        palette: {
            mode: paletteType,
            background: {
                default: "#202225"
            },
            primary: {
                main: "#f5f5f5",
                dark: "#505050",
                light: "#fff"
            },
            secondary: {
                main: "#580B0B",
                dark: "#380707",
                light: "#9a2828"
            },
            third: {
                main: "#C9C9C9"
            }
        },
        components: {
            MuiDivider: {
                styleOverrides: {
                    root: {
                        borderImage: 'url(https://www.worldofdarkness.com/packs/media/misc/doily-8401e635.png) 40'
                    }
                }
            },
            MuiSpeedDial: {
                styleOverrides: {
                    fab: {
                        backgroundColor: "#580B0B",
                        color: "white"
                    },
                    "fab:hover": {
                        backgroundColor: "#580B0B",
                        color: "white"
                    }
                }
            }
        }
    });

    const snackbarsRef = createRef();

    const onSnackbarDismissClick = key =>
        () => (snackbarsRef.current: any).closeSnackbar(key);

    // const handleThemeChange = () => {
    //     setDarkState(!darkState);
    // };

    return (
        <ThemeProvider theme={darkTheme}>
            <Suspense fallback={<MainSuspenseFallback />}>
                <BackdropProvider>
                    <SnackbarProvider maxSnack={3}
                                      ref={snackbarsRef}
                                      preventDuplicate
                                      variant="outlined"
                                      action={key =>
                                          <Button onClick={onSnackbarDismissClick(key)} sx={{
                                              color: "black"
                                          }}>
                                              OK
                                          </Button>
                                      }>
                        <DialogProvider>
                            <RecoilRoot>
                                <Internal env={environment} />
                            </RecoilRoot>
                        </DialogProvider>
                    </SnackbarProvider>
                </BackdropProvider>
            </Suspense>
        </ThemeProvider>
    );
}

export default App;
