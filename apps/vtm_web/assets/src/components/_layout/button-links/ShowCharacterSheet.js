// @flow

import React from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import {menuIconStyle} from "../menu/menu-base-utils";
import {MainRoutes} from "../../MainRouter";
import {useHistory} from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import {iconButtonSize} from "./constants";
import type {GenericReactComponent} from "../../../_base/types";

type Props = {
    characterId: ?string;
    onSelected?: () => void;
    asMenuItem?: boolean;
}

const ShowCharacterSheet = ({characterId, onSelected, asMenuItem}: Props): GenericReactComponent => {
    const history = useHistory();

    const tryVisualizeCharacterSheet = (characterId: string) =>
        (_: any) => {
            history.push(MainRoutes.sheet(characterId));

            if (onSelected != null) {
                onSelected();
            }
        }

    if (characterId != null) {
        if (asMenuItem === true) {
            return (
                <MenuItem onClick={tryVisualizeCharacterSheet(characterId)}>
                    <ListItemIcon>
                        <ContactPageIcon />
                    </ListItemIcon>
                    Mostra scheda
                </MenuItem>
            );
        }

        return (
            <Tooltip title="Visualizza scheda">
                <IconButton aria-label="Messaggio"
                            size={iconButtonSize}
                            onClick={tryVisualizeCharacterSheet(characterId)}>
                    <ContactPageIcon sx={menuIconStyle} />
                </IconButton>
            </Tooltip>
        );
    }

    return (<></>);
};

export default ShowCharacterSheet;
