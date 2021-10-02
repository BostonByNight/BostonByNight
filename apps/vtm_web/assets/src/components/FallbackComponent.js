// @flow

import React from "react";
import MainLayout from "./MainLayout";
import Typography from "@mui/material/Typography";

type Props = {
    error: any,
    retry: ?(() => void),
}

const FallbackComponent = ({error}: Props): any => {
    return (
        <MainLayout>
            <Typography>
                There was an error in the app: {JSON.stringify(error)}
            </Typography>
        </MainLayout>
    )
}

export default FallbackComponent;
