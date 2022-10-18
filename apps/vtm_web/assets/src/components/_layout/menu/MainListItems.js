// @flow

import React, {Suspense, useState} from "react";
import {useHistory} from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {MainRoutes} from "../../MainRouter";
import MapIcon from "@mui/icons-material/Map";
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import MenuCharacterSection from "./menu-character/MenuCharacterSection";
import MenuHuntSection from "./sections/MenuHuntSection";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import CameraIndoorTwoToneIcon from '@mui/icons-material/CameraIndoorTwoTone';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import type {MenuProps} from "./menu-base-utils";
import {menuIconStyle, MenuSecondaryText} from "./menu-base-utils";
import useIsChatRoute from "../../_hooks/useIsChatRoute";
import type {GenericReactComponent} from "../../../_base/types";

const CharacterSheetModal = React.lazy(() => import('./dialog/SheetDialog'));

const MainListItems = ({drawerDone, reloadCount, onUpdate}: MenuProps): GenericReactComponent => {
    const history = useHistory();
    const [popupOpen, setPopupOpen] = useState(false);
    const [requested, setRequested] = useState(false);
    const isChatRoute = useIsChatRoute();

    const pushHistory = (route: string) => {
        drawerDone();

        if (route.indexOf("sheet") !== -1 && isChatRoute) {
            pushComponentOnPopup();
        }
        else {
            history.push(route);
        }
    };

    const handlePopupOpen = () => setPopupOpen(_ => true);

    const handlePopupClose = () => setPopupOpen(_ => false);

    const pushComponentOnPopup = () => {
        setRequested(_ => true);
        handlePopupOpen();
    };

    const characterSheetModal = () =>
        // Performance - opening and rendering the popup only when needed
        isChatRoute && requested
            ? (<CharacterSheetModal open={popupOpen} handleClose={handlePopupClose} />)
            : (<></>);

    return (
        <>
            <ListItem button onClick={_ => pushHistory(MainRoutes.mainMap)}>
                <ListItemIcon>
                    <MapIcon sx={menuIconStyle} />
                </ListItemIcon>
                <ListItemText secondary={<MenuSecondaryText text="Mappa" />} />
            </ListItem>
            <ListItem button onClick={_ => pushHistory(MainRoutes.bookChat)}>
                <ListItemIcon>
                    <LockOpenTwoToneIcon sx={menuIconStyle} />
                </ListItemIcon>
                <ListItemText secondary={<MenuSecondaryText text="Prenota Chat Private" />} />
            </ListItem>
            <Suspense fallback={<></>}>
                {characterSheetModal()}
            </Suspense>
            <MenuCharacterSection pushHistory={pushHistory}
                                  reloadCount={reloadCount}
                                  onUpdate={onUpdate} />
            <MenuHuntSection />
            <ListItem button onClick={_ => pushHistory(MainRoutes.havenEvents)}>
                <ListItemIcon>
                    <AttachMoneyIcon sx={menuIconStyle} />
                </ListItemIcon>
                <ListItemText secondary={<MenuSecondaryText text="Scambia denaro" />} />
            </ListItem>
            <ListItem button onClick={_ => pushHistory(MainRoutes.havenEvents)}>
                <ListItemIcon>
                    <CameraIndoorTwoToneIcon sx={menuIconStyle} />
                </ListItemIcon>
                <ListItemText secondary={<MenuSecondaryText text="Eventi Dominio" />} />
            </ListItem>
            <ListItem button onClick={_ => pushHistory(MainRoutes.charactersList)}>
                <ListItemIcon>
                    <SupervisedUserCircleIcon sx={menuIconStyle} />
                </ListItemIcon>
                <ListItemText secondary={<MenuSecondaryText text="Lista personaggi" />} />
            </ListItem>
        </>
    );
};

export default MainListItems;
