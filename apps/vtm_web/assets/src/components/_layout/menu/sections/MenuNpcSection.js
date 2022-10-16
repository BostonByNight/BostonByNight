// @flow

import React, {Suspense, useState} from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GroupsIcon from '@mui/icons-material/Groups';
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {Collapse} from "@mui/material";
import List from "@mui/material/List";
import {MainRoutes} from "../../../MainRouter";
import {menuIconStyle, MenuSecondaryText} from "../menu-base-utils";
import type {UserCharacter} from "../../../../services/queries/accounts/UserCharactersQuery";
import MenuNpcSectionItems from "./MenuNpcSectionItems";
import MenuItemSuspenseFallback from "../MenuItemSuspenseFallback";
import type {GenericReactComponent} from "../../../../_base/types";
import {useCharacterRecoilState} from "../../../../session/hooks";

type Props = {
    pushHistory: string => void;
    reloadCount: number;
    onUpdate: () => void;
};

const MenuNpcSection = ({pushHistory, reloadCount, onUpdate}: Props): GenericReactComponent => {
    const [expand, setExpand] = useState(false);
    const [hasBeenExpanded, setHasBeenExpanded] = useState(false);
    const [,setCurrentCharacter] = useCharacterRecoilState()

    const toggleNpcsSelectionMenuExpansion = (_: any) => {
        setHasBeenExpanded(_ => true);
        setExpand(p => !p);
    }
    
    const handleSheetSelection = (info: UserCharacter) =>
        _ => pushHistory(MainRoutes.sheet(info.id));

    const handleCharacterSelection = (info: UserCharacter) =>
        (_: any) => {
            setCurrentCharacter({
                id: info.id,
                name: info.name,
                approved: info.approved,
                clan: {
                    name: info.clan?.name
                }
            });

            onUpdate();
        };

    const sectionItems = () => (
        <Suspense fallback={<MenuItemSuspenseFallback items={3} />}>
            <List component="div" disablePadding>
                {expand
                    ? (<MenuNpcSectionItems reloadCount={reloadCount}
                                            handleSheetSelection={handleSheetSelection}
                                            handleCharacterSelection={handleCharacterSelection} />)
                    : (<></>)
                }
            </List>
        </Suspense>
    )

    const expandedMenu = () =>
        hasBeenExpanded
            ? sectionItems()
            : (<></>);

    return (
        <>
            <ListItem button onClick={toggleNpcsSelectionMenuExpansion}>
                <ListItemIcon>
                    <GroupsIcon sx={menuIconStyle} />
                </ListItemIcon>
                <ListItemText secondary={<MenuSecondaryText text="NPGs" />} />
                {expand ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={expand} timeout="auto">
                {expandedMenu()}
            </Collapse>
        </>
    );
}

export default MenuNpcSection;
