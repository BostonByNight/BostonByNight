// @flow

import React from "react";
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from "@mui/icons-material/Assignment";
import {useHistory} from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import type {GenericReactComponent} from "../../../_base/types";
import {Menu, MenuItem, Divider, Link, Box, Button} from "@mui/material";
import LogoutControl from "./LogoutControl";
import ReloadControl from "./ReloadControl";
import {MainRoutes} from "../../MainRouter";
import SettingsIcon from "@mui/icons-material/Settings";
import {menuIconStyle} from "../menu/menu-base-utils";
import {useUserCharactersQuery} from "../../../services/queries/accounts/UserCharactersQuery";
import MenuForumSection from "../menu/sections/MenuForumSection";
import {useForumHasNewPosts} from "../../../services/queries/forum/ForumHasNewPostQuery";

type UserMenuComponentProps = {
    reloadCount: number;
}

const UserMenuComponent = ({reloadCount}: UserMenuComponentProps): GenericReactComponent => {
    const history = useHistory();
    const forumHasNewPosts = useForumHasNewPosts();
    const characters = useUserCharactersQuery(reloadCount);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const forumIconStyle =
        forumHasNewPosts
            ? {
                ...menuIconStyle,
                color: "#C31313"
            }
            : menuIconStyle;

    const characterName = () =>
        characters?.length > 0
            ? characters[0]?.name
            : "Menu";

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Menù utente">
                    <Button
                        onClick={handleClick}
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'user-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        startIcon={<PersonIcon />}
                    >
                        {characterName()}
                    </Button>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="user-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    sx: {
                        right: "0!important",
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiPaper-root': {
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >

                <MenuItem button onClick={_ => history.push(MainRoutes.settings)}>
                    <SettingsIcon sx={menuIconStyle} />
                    Impostazioni
                </MenuItem>
                <divider />
                <MenuForumSection itemStyle={{
                    forumIconStyle
                }} />
                <Link href="https://guide.bostonbynight-gdr.it" target="_blank" sx={{
                    textDecoration: 'none',
                    '& :hover': {
                        color: '#fff'
                    }
                }}>
                    <MenuItem>
                         <AssignmentIcon sx={menuIconStyle} /> Guide
                    </MenuItem>
                </Link>
                <Divider />
                <ReloadControl />
                <Divider />
                <LogoutControl />
            </Menu>
        </React.Fragment>
    );
}

export default UserMenuComponent;
