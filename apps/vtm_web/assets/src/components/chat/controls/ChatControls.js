// @flow

import React from "react";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import HealingIcon from '@mui/icons-material/Healing';
import RoomIcon from '@mui/icons-material/Room';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import FlashOnOutlinedIcon from '@mui/icons-material/FlashOnOutlined';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import {useTheme} from "@mui/material/styles";
import {useRelayEnvironment} from "react-relay";
import RouseCheckMutation from "../../../services/mutations/chat/RouseCheckMutation";
import {castNotNull, handleMutation,} from "../../../_base/utils";
import UseWillpowerChatMutation from "../../../services/mutations/chat/UseWillpowerChatMutation";
import HealMutation from "../../../services/mutations/chat/HealMutation";
import {menuIconStyle} from "../../_layout/menu/menu-base-utils";
import DownloadIcon from '@mui/icons-material/Download';
import type {GenericReactComponent} from "../../../_base/types";
import {useDialog} from "../../../_base/providers/DialogProvider";
import {useCustomSnackbar} from "../../../_base/notification-utils";
import {useRecoilValue} from "recoil";
import {sessionCharacterStateAtom} from "../../../session/atoms";

type Props = {
    openMapModal: () => void;
    openCharacterStatusPopup: () => void;
    mapId: string;
    onChatLogRequested: () => void;
};

const ChatControls = ({openMapModal, openCharacterStatusPopup, mapId, onChatLogRequested}: Props): GenericReactComponent => {
    const environment = useRelayEnvironment();
    const theme = useTheme();
    const {showDialog} = useDialog()
    const {enqueueSnackbar} = useCustomSnackbar()
    const character = useRecoilValue(sessionCharacterStateAtom)
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const onMapClicked = (_: any) => {
        openMapModal();
        handleClose();
    };

    const onChatLogRequestedHandler = (_: any) => {
        onChatLogRequested();
        handleClose();
    };

    const showSelectCharacterNotification = () => 
        enqueueSnackbar({
            type: "warning",
            message: "Devi prima selezionare un personaggio"
        });

    const vampireReservedActions = () => {
        if (character?.clan?.name === "Umano") {
            return [];
        }

        return [
            <SpeedDialAction key={1}
                             icon={<BloodtypeIcon sx={menuIconStyle} />}
                             tooltipTitle="Spendi vitae"
                             onClick={requestRouseCheck} />,
            <SpeedDialAction key={2}
                             icon={<FlashOnOutlinedIcon sx={menuIconStyle} />}
                             tooltipTitle="Spendi WP"
                             onClick={requestWillpowerUse} />,
            <SpeedDialAction key={3}
                             icon={<HealingIcon sx={menuIconStyle} />}
                             tooltipTitle="Guarisci"
                             onClick={requestHeal} />
        ];
    }

    const requestRouseCheck = (_: any) => {
        if (character?.id != null) {
            showDialog("Vitae", "Sei sicuro di voler spendere vitae?",
                () => {
                    handleMutation(() =>
                        RouseCheckMutation(environment, {
                            characterId: castNotNull(character?.id),
                            chatMapId: mapId
                        }), enqueueSnackbar);
                });
        }
        else {
            showSelectCharacterNotification();
        } 

        handleClose();
    }

    const requestWillpowerUse = (_: any) => {
        showDialog("Forza di Volontà", "Sei sicuro di voler spendere Forza di Volontà?",
            () => {
                if (character?.id != null) {
                    handleMutation(() =>
                        UseWillpowerChatMutation(environment, {
                            characterId: castNotNull(character?.id),
                            chatMapId: mapId
                        }), enqueueSnackbar);
                }
                else {
                    showSelectCharacterNotification();
                }
            });

        handleClose();
    }

    const requestHeal = (_: any) => {
        showDialog(
            "Guarire",
            "Sei sicuro di voler spendere vitae per guarire il personaggio?\nRicorda che puoi farlo solo una volta per turno, e il tentativo apparirà in chat.",
            () => {
                if (character?.id != null) {
                    handleMutation(
                        () => HealMutation(environment, castNotNull(character?.id), mapId),
                        enqueueSnackbar
                    );
                }
                else {
                    showSelectCharacterNotification();
                }
            }
        );
    };

    return (
        <SpeedDial ariaLabel="Azioni chat"
                   sx={{
                       position: 'absolute',
                       top: theme.spacing(10),
                       right: theme.spacing(3)
                   }}
                   icon={<SpeedDialIcon sx={menuIconStyle} />}
                   onClose={handleClose}
                   onOpen={handleOpen}
                   direction="down"
                   open={open}>
            <SpeedDialAction icon={<RoomIcon sx={menuIconStyle} />}
                             tooltipTitle="Location"
                             onClick={onMapClicked} />
            <SpeedDialAction icon={<DownloadIcon sx={menuIconStyle} />}
                             tooltipTitle="Download Chat"
                             onClick={onChatLogRequestedHandler} />
            <SpeedDialAction icon={<AssignmentIndIcon sx={menuIconStyle} />}
                             tooltipTitle="Status"
                             onClick={_ => openCharacterStatusPopup()} />
            {vampireReservedActions()}
        </SpeedDial>
    )
}

export default ChatControls;
