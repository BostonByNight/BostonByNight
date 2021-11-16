// @flow

import React from "react";
import Box from "@mui/material/Box";

export type TabPanelProps = {
    children: any;
    value: number;
    index: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps): any => {
    return (
        <div role="tabpanel"
             hidden={value !== index}
             id={`simple-tabpanel-${index}`}
             aria-labelledby={`simple-tab-${index}`}>
             {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

export default TabPanel
