// @flow

import React from "react";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import type {Formik} from "./FormTypes";
import {useTheme} from "@mui/material/styles";
import type {GenericReactComponent} from "../types";
import type {SelectProps} from "../component-helpers";
import {getSelectItems} from "../component-helpers";
import FormHelperText from "@mui/material/FormHelperText";

export type SelectInputProps = SelectProps & {
    formik: Formik;
    renderValue?: ?(?string[] => GenericReactComponent);
    multiple?: boolean;
    containerSx?: any;
};

const emptyMenuItem = () => (
    <MenuItem key="element-zero" value={null}>None</MenuItem>
);

const FormSelectField = (props: SelectInputProps): GenericReactComponent => {
    const theme = useTheme();

    const items = () => getSelectItems(props, emptyMenuItem);

    return (
        <FormControl sx={{
            ...props.containerSx,
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
                    multiple={props.multiple}
                    label={props.label}
                    value={props.formik.values[props.fieldName]}
                    onChange={props.formik.handleChange}
                    renderValue={props.renderValue}
                    error={props.formik.touched[props.fieldName] && Boolean(props.formik.errors[props.fieldName])}>
                {items()}
            </Select>
            <FormHelperText sx={{color: "red"}}>{props.formik.errors[props.fieldName]}</FormHelperText>
        </FormControl>
    );
}

export default FormSelectField;
