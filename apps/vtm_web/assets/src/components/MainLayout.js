// @flow

import React, {useState} from 'react';
import {useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {menuIconStyle} from "./_layout/menu/menu-base-utils";
import {useMediaQuery} from "@mui/material";
import MessageControl from "./_layout/app-bar-controls/MessageControl";
import OnlineControl from "./_layout/app-bar-controls/OnlineControl";
import LogoutControl from "./_layout/app-bar-controls/LogoutControl";
import DefaultFallback from "../_base/components/DefaultFallback";
import ReloadControl from "./_layout/app-bar-controls/ReloadControl";
import {useMessageSubscription} from "./_hooks/useMessageSubscription";
import ReturnToChatControl from "./_layout/app-bar-controls/ReturnToChatControl";
import SecondaryListItems from "./_layout/menu/SecondaryListItems";
import MainListItems from "./_layout/menu/MainListItems";
import CommonListItems from "./_layout/menu/CommonListItems";
import type {GenericReactComponent} from "../_base/types";
import {useRecoilValue} from "recoil";
import {isUserMasterSelector} from "../session/selectors";

const drawerWidth = 300;

const SwipeableDrawer = React.lazy(() => import("@mui/material/SwipeableDrawer"));

const PageDrawer = ({open, setOpen, children}) => {
    const theme = useTheme();
    const container = window !== undefined ? () => window.document.body : undefined;
    const fullScreen = useMediaQuery(theme.breakpoints.up('md'));

    if (fullScreen) {
        return (
            <Drawer variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            position: 'relative',
                            height: '100%',
                            border: 0,
                            backgroundColor: 'inherit',
                        }
                    }}
                    open>
                {children}
            </Drawer>
        );
    }

    return (
        <SwipeableDrawer container={container}
                         variant="temporary"
                         open={open}
                         onOpen={_ => setOpen(p => !p)}
                         onClose={_ => setOpen(p => !p)}
                         ModalProps={{
                             keepMounted: true, // Better open performance on mobile.
                         }}
                         sx={{
                             display: { xs: 'block', md: 'none' },
                             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                         }}>
            {children}
        </SwipeableDrawer>
    );
};

const MainLayout = ({children}: {children: any}): GenericReactComponent => {
    const theme = useTheme()
    const [open, setOpen] = React.useState(false)
    const isUserMaster = useRecoilValue(isUserMasterSelector)
    const numberOfMessages = useMessageSubscription()

    const [characterFetchKey, setCharacterFetchKey] = useState(Math.round(Math.random() * 100));

    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const showCompressedTitle = useMediaQuery(theme.breakpoints.down('sm'));
    const showPartialTitle = useMediaQuery(theme.breakpoints.down('lg'));

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const closeOnSelected = () => {
        if (isSmallScreen) {
            handleDrawerClose();
        }
    }

    const onCharacterUpdate = () => {
        setCharacterFetchKey(p => p + 1);
    }

    const masterMenu = () => {
        if (isUserMaster) {
            return (
                <>
                    <Divider/>
                    <List>
                        <SecondaryListItems drawerDone={closeOnSelected}
                                            onUpdate={onCharacterUpdate}
                                            reloadCount={characterFetchKey} />
                    </List>
                </>
            );
        }

        return (<></>);
    };

    const title = () => {
        return "Boston by Night";
    }

    const drawerContent = () => (
        <Box sx={{
            borderRight: '1px solid #fff',
            borderImage: 'url(https://www.worldofdarkness.com/packs/media/misc/doily-8401e635.png) 40',
        }}>
            <Toolbar />
            <List>
                <MainListItems drawerDone={closeOnSelected}
                               onUpdate={onCharacterUpdate}
                               reloadCount={characterFetchKey} />
            </List>
            {masterMenu()}
            <Divider />
            <CommonListItems />
        </Box>
    );

    return (
        <Box sx={{
            display: 'flex',
            overflow: "auto"
        }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} sx={{
                backgroundImage: 'none',
                boxShadow: 'none',
                zIndex: 1201
            }}>
                <Toolbar>
                    <IconButton color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{
                                    marginRight: '36px',
                                    mr: 2,
                                    display: { md: 'none' }
                                }}>
                        <MenuIcon sx={menuIconStyle} />
                    </IconButton>
                    <Typography variant="h6"
                                noWrap
                                component="h1"
                                color="inherit"
                                sx={{
                                    flexGrow: "1",
                                    fontFamily: 'Gothic',
                                    color: "primary.main",
                                    fontSize: "2.7rem"
                                }}>
                        {title()}
                    </Typography>
                    <ReturnToChatControl />
                    <ReloadControl />
                    <MessageControl numberOfMessages={numberOfMessages} />
                    <OnlineControl />
                    <LogoutControl />
                </Toolbar>
            </AppBar>
            <List component="nav"
                  sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 }, height: '100%' }}
                  aria-label="mailbox folders">
                <PageDrawer open={open} setOpen={setOpen}>
                    {drawerContent()}
                </PageDrawer>
            </List>
            <Box component="main" sx={{
                flexGrow: 1,
                p: 3,
                width: { lg: `calc(100% - ${drawerWidth}px)` },
                // background: "url('pattern.webp')"
                // backgroundColor: "linear-gradient(to right, #19191900, #191919)"
            }} >
                <Toolbar />
                <React.Suspense fallback={<DefaultFallback />}>
                    {children}
                </React.Suspense>
            </Box>
        </Box>
    );
};

export default MainLayout;
