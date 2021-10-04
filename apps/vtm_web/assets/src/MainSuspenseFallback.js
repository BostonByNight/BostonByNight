// @flow

import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

type Props = {

}

const MainSuspenseFallback = (props: Props): any => {
    return (
        <Box sx={{ width: "100%" }}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
        </Box>
    );
}

export default MainSuspenseFallback;
