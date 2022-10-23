// @flow

import React, {Suspense, useState} from "react";
import {useHistory} from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {MainRoutes} from "../../MainRouter";
import MapIcon from "@mui/icons-material/Map";
import MenuCharacterSection from "./menu-character/MenuCharacterSection";
import MenuHuntSection from "./sections/MenuHuntSection";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import CameraIndoorTwoToneIcon from '@mui/icons-material/CameraIndoorTwoTone';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import type {MenuProps} from "./menu-base-utils";
import {menuIconStyle, MenuSecondaryText} from "./menu-base-utils";
import useIsChatRoute from "../../_hooks/useIsChatRoute";
import type {GenericReactComponent} from "../../../_base/types";
import {useCustomSnackbar} from "../../../_base/notification-utils";
import {useRelayEnvironment} from "react-relay";
import RefreshCharacterOccupationSalaryMutation
    from "../../../services/mutations/occupations/RefreshCharacterOccupationSalaryMutation";
import {useRecoilValue} from "recoil";
import {sessionCharacterStateAtom} from "../../../session/atoms";

const CharacterSheetModal = React.lazy(() => import('./dialog/SheetDialog'));

const MainListItems = ({drawerDone, reloadCount, onUpdate}: MenuProps): GenericReactComponent => {
    const environment = useRelayEnvironment()
    const {enqueueSnackbar} = useCustomSnackbar()
    const character = useRecoilValue(sessionCharacterStateAtom)
    const history = useHistory()

    const [popupOpen, setPopupOpen] = useState(false)
    const [requested, setRequested] = useState(false)

    const isChatRoute = useIsChatRoute()

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

    const checkSalary = (_: any) => {
        const handleGenericError = (error: any) => {
            console.error("There was an error while trying to check salary", error)
            enqueueSnackbar({
                type: "error",
                message: "C'è stato un errore durante la modifica del personaggio, contatta l'admin per maggiori informazioni."
            })
        }

        if (character?.id != null) {
            RefreshCharacterOccupationSalaryMutation(environment, {
                characterId: character?.id,
            }).then(({refreshCharacterOccupationSalary}) => {
                if (refreshCharacterOccupationSalary?.result?.type === "ok") {
                    enqueueSnackbar({
                        type: "success",
                        message: "Stipendio correttamente incassato."
                    })
                }
                else if (refreshCharacterOccupationSalary?.result?.type === "error") {
                    enqueueSnackbar({
                        type: "error",
                        message: refreshCharacterOccupationSalary?.result?.message ?? "Non è passato ancora un giorno dall'ultima riscossione"
                    })
                }
                else {
                    handleGenericError(refreshCharacterOccupationSalary?.result)
                }
            }).catch(handleGenericError)
        }
    }

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
            {
                character?.id != null && character?.approved
                    ? (
                        <>
                            <ListItem button onClick={checkSalary}>
                                <ListItemIcon>
                                    <AccountBalanceWalletIcon sx={menuIconStyle} />
                                </ListItemIcon>
                                <ListItemText secondary={<MenuSecondaryText text="Incassa stipendio" />} />
                            </ListItem>
                            <ListItem button onClick={_ => pushHistory(MainRoutes.listTransactions)}>
                                <ListItemIcon>
                                    <AttachMoneyIcon sx={menuIconStyle} />
                                </ListItemIcon>
                                <ListItemText secondary={<MenuSecondaryText text="Scambia denaro" />} />
                            </ListItem>
                        </>
                    )
                    : (<></>)
            }
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
