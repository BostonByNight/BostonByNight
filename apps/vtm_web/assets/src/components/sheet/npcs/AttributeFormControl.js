// @flow

import React from "react";
import Rating from "@mui/material/Rating";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import {Attribute} from "../../../services/queries/character/GetCharacterStatsQuery";
import Grid from "@mui/material/Grid";

type Props = {
    characterId: string;
    attribute: Attribute;
    maxValue: number;
    onChange: Attribute => void;
}

const AttributeFormControl = ({characterId, attribute, maxValue, onChange}: Props): any => {
    const onChangeInternal = ({target: {value}}) =>
        onChange({
            ...attribute,
            value
        });

    return (
        <Grid container>
            <Grid item xs={6}>
                {attribute?.name}
            </Grid>
            <Grid item xs={6}>
                <Rating name={attribute.name}
                        defaultValue={attribute.value}
                        icon={<FiberManualRecordIcon />}
                        emptyIcon={<FiberManualRecordOutlinedIcon />}
                        onChange={onChangeInternal}
                        max={maxValue} />
            </Grid>
        </Grid>
    );
}

export default AttributeFormControl;
