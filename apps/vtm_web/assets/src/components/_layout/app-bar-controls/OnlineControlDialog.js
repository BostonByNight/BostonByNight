// @flow

import React from "react";
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import {listSessionQuery} from "../../../services/queries/accounts/SessionQuery";
import Tooltip from "@mui/material/Tooltip";
import ListItemIcon from "@mui/material/ListItemIcon";
import AttributionIcon from "@mui/icons-material/Attribution";
import {menuIconStyle} from "../menu/menu-base-utils";
import Stack from "@mui/material/Stack";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ShowCharacterSheet from "../button-links/ShowCharacterSheet";
import SendMessageToUser from "../button-links/SendMessageToUser";
import GoToMapLocation from "../button-links/GoToMapLocation";
import SendMessageToCharacter from "../button-links/SendMessageToCharacter";
import {useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import MenuLayout from "../../../_base/components/MenuLayout";
import {emptyExactObject} from "../../../_base/utils";
import {isUserRoleMaster} from "../../../services/base-types";
import type {GenericReactComponent} from "../../../_base/types";
import type {Role} from "../../../services/queries/accounts/__generated__/SessionQuery.graphql";

type OnlineUserType = {|
    +id: string,
    +name: ?string,
    +role: ?Role,
|}

type OnlineQueryType = {|
    +user: ?OnlineUserType,
    +character: ?{|
        +id: string,
        +name: ?string,
    |},
    +location: ?{|
        +id: string,
        +name: ?string,
    |},
    +visible: ?boolean,
|}

type Props = {
    closePopup: () => void;
}

type OnlineControlActionProps = {
    o: ?OnlineQueryType,
    closePopup: () => void
}

const OnlineControlActionsBigScreen = ({o, closePopup}: OnlineControlActionProps) => (
    <Stack direction="row">
        <ShowCharacterSheet characterId={o?.character?.id} onSelected={closePopup} />
        <SendMessageToUser userId={o?.user?.id} onSelected={closePopup} />
        {
            o?.character != null
                ? (<SendMessageToCharacter characterId={o?.character?.id} onSelected={closePopup} />)
                : (<></>)
        }
        <GoToMapLocation location={o?.location} onSelected={closePopup} />
    </Stack>
);

const OnlineControlActionsSmallScreen = ({o, closePopup}: OnlineControlActionProps) => {
    const onSelected = (onItemSelected: () => void) =>
        () => {
            onItemSelected();
            closePopup();
        };

    return (
        <MenuLayout>
            { onItemSelected =>
                <>
                    <ShowCharacterSheet characterId={o?.character?.id}
                                        onSelected={onSelected(onItemSelected)}
                                        asMenuItem />
                    <SendMessageToUser userId={o?.user?.id}
                                       onSelected={onSelected(onItemSelected)}
                                       asMenuItem />
                    {
                        o?.character != null
                            ? (<SendMessageToCharacter characterId={o?.character?.id}
                                                       onSelected={onSelected(onItemSelected)}
                                                       asMenuItem />)
                            : (<></>)
                    }
                    <GoToMapLocation location={o?.location}
                                     onSelected={onSelected(onItemSelected)}
                                     asMenuItem />
                </>
            }
        </MenuLayout>
    );
}

const OnlineControlDialog = ({closePopup}: Props): GenericReactComponent => {
    const theme = useTheme();
    const online = useCustomLazyLoadQuery(listSessionQuery, emptyExactObject(), {
        fetchPolicy: "network-only"
    })?.sessionsList ?? [];

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

    const userMasterIcon = (user: ?OnlineUserType) =>
        isUserRoleMaster(user?.role)
            ? (
                <Tooltip title="Master">
                    <ListItemIcon>
                        <AttributionIcon sx={menuIconStyle} />
                    </ListItemIcon>
                </Tooltip>
            )
            : (<></>);

    const secondaryActions = (o: ?OnlineQueryType) =>
        isSmallScreen
            ? (<OnlineControlActionsSmallScreen o={o} closePopup={closePopup} />)
            : (<OnlineControlActionsBigScreen o={o} closePopup={closePopup} />);

    const onlineUserAndCharacterName = (o: ?OnlineQueryType) => {
        if (o?.character?.name != null) {
            return `${o.character.name} (${o.user?.name ?? ""})`;
        }

        return `${o?.user?.name ?? ""}`;
    };

    const onlineRow = (o: ?OnlineQueryType) => (
        <ListItem key={o?.user?.id}
                  secondaryAction={secondaryActions(o)}>
            {userMasterIcon(o?.user)}
            <ListItemText inset={!isUserRoleMaster(o?.user?.role)}
                          primary={onlineUserAndCharacterName(o)}
                          secondary={o?.location?.name}
            />
        </ListItem>
    );

    const onlineUserSorter = (a: ?OnlineQueryType, b: ?OnlineQueryType) => {
        const masterRoleAsNumber = (onlineItem: ?OnlineQueryType) =>
            onlineItem?.user?.role === "MASTER" ? 0 : 1;

        const [aRole, bRole] = [masterRoleAsNumber(a), masterRoleAsNumber(b)];

        if (aRole > bRole) {
            return 1;
        }

        if (aRole < bRole) {
            return -1;
        }

        const [aName, bName] = [a?.user?.name ?? "", b?.user?.name ?? ""];

        if (aName > bName) {
            return 1;
        }

        return -1;
    };

    // Used the rest operator because the read only array doesn't have a sort method
    const showOnline = () => [...online]
        ?.sort((a, b) => onlineUserSorter(a, b))
        ?.map(o => onlineRow(o)) ?? (<></>);

    return showOnline();
};

export default OnlineControlDialog;
