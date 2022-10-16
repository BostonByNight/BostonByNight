// @flow

import React, {useState} from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import ImageMapper from "react-img-mapper";
import Typography from "@mui/material/Typography";
import type {Haven} from "../../services/queries/haven/GetHavensQuery";
import type {MapAreas} from "../_base/haven-map-areas-helpers";
import type {GenericReactComponent} from "../../_base/types";

type Props = {
    areas: Array<MapAreas>;
    onAreaSelected: (Haven | string) => void;
}

export const mainMapWidth = 800;

export const mainMapHeight = 510;

const MainMapImageMapper = ({areas, onAreaSelected}: Props): GenericReactComponent => {
    const [legend, setLegend] = useState("");

    const legendFontSize = () => {
        if (legend.length > 50) {
            return "1.1rem";
        }
        if (legend.length > 40) {
            return "1.2rem";
        }
        else if (legend.length > 30) {
            return "1.5rem";
        }
        else {
            return "2rem";
        }
    }

    const map = {
        name: "haven-map",
        areas: areas
    };

    const onMouseEnter = ({title}) => {
        setLegend(_ => title);
    };

    const onMouseLeave = (_: any) => {
        setLegend(_ => "");
    };

    const onAreaSelectedInternal = ({haven, name}: MapAreas) => onAreaSelected(haven ?? name);

    return (
        <Box component="div" sx={{display: "inline-flex", width: "100%"}}>
            <Paper component="div" variant="outlined" sx={{
                margin: "0 auto",
                width: `${(mainMapWidth + 2)}px`,
                height: `${(mainMapHeight + 58)}px`,
                textAlign: "center"
            }}>
                <Stack>
                    <Box sx={{cursor: "pointer"}}>
                        <ImageMapper src="main-map.webp"
                                     map={map}
                                     onClick={onAreaSelectedInternal}
                                     onMouseEnter={onMouseEnter}
                                     onMouseLeave={onMouseLeave} />
                    </Box>
                    <Box sx={{
                        margin: "0 auto",
                        minHeight: "55px",
                        display: "flex"
                    }}>
                        <Typography sx={{
                            fontFamily: "Gothic",
                            fontSize: legendFontSize(),
                            alignSelf: "center",
                        }}>
                            {legend}
                        </Typography>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
};

export default MainMapImageMapper;
