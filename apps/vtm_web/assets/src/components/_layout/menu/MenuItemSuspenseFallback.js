// @flow

import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import {rangeArray} from "../../../_base/utils";

type MenuItemSuspenseFallbackLineProps = {
    hideSelection?: boolean
}

const MenuItemSuspenseFallbackLine = ({hideSelection}: MenuItemSuspenseFallbackLineProps) => (
    <Stack direction="row" sx={{
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    }}>
        <Box sx={{padding: "10px"}}>
            <Skeleton variant="circular" width={30} height={30} />
        </Box>
        <Typography variant="h3" sx={{width: "100%"}}><Skeleton /></Typography>
        {hideSelection === true
            ? (<></>)
            : (
                <Box sx={{padding: "10px"}}>
                    <Skeleton variant="circular" width={20} height={20}/>
                </Box>
            )
        }
    </Stack>
)

type Props = {
    items: number;
    hideSelection?: boolean;
};

const MenuItemSuspenseFallback = ({items, hideSelection}: Props): any => (
    <Stack spacing={0}>
        {rangeArray(1, items).map(i => <MenuItemSuspenseFallbackLine key={i}
                                                                     hideSelection={hideSelection} />)}
    </Stack>
);

export default MenuItemSuspenseFallback;
