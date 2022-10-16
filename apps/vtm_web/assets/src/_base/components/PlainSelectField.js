// @flow

import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useTheme} from "@mui/material/styles";
import type {GenericEvent, GenericReactComponent} from "../types";
import type {SelectProps} from "../component-helpers";
import {getSelectItems} from "../component-helpers";

type Props = SelectProps & {
    onChange: string => void;
    selectedValue: string;
}

const emptyMenuItem = () => (
    <MenuItem key="element-zero" value={null}>None</MenuItem>
);

const PlainSelectField = (props: Props): GenericReactComponent => {
    const theme = useTheme();

    const items = () => getSelectItems(props, emptyMenuItem);

    const onChange = ({target: {value}}: GenericEvent) => props.onChange(value);

    return (
        <FormControl sx={{
            margin: theme.spacing(1),
            minWidth: 150,
        }}>
            <InputLabel id={`select-for-${props.fieldName}`}>{props.label}</InputLabel>
            <Select labelId={`select-for-${props.fieldName}`}
                    id={props.fieldName}
                    name={props.fieldName}
                    fullWidth
                    sx={{
                        ...props.sx,
                        minWidth: theme.spacing(10)
                    }}
                    label={props.label}
                    value={props.selectedValue}
                    onChange={onChange}>
                {items()}
            </Select>
        </FormControl>
    );
}

export default PlainSelectField;
