// @flow

import React from "react";
import type {Formik} from "./FormTypes";
import FormControl from "@mui/material/FormControl";
import {useTheme} from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import type {GenericEvent, GenericReactComponent} from "../types";

type Props = {
    formik: Formik;
    fieldName: string;
    label: string;
    values: Array<[string, string]>;
}

const FormAutocompleteField = (props: Props): GenericReactComponent => {
    const theme = useTheme();

    const onChanged = (e: GenericEvent) => {
        const {target: {textContent}} = e;
        const values = props.values.filter(([_, text]) => text === textContent);

        if (values.length === 1) {
            const [[id]] = values;
            props.formik.handleChange({
                ...e,
                target: {
                    ...e.target,
                    name: props.fieldName,
                    id: props.fieldName,
                    value: id
                }
            });
        }
    }

    const getValue = () => {
        const value = props.values.filter(([id]) => props.formik.values[props.fieldName] === id);

        if (value != null && value.length === 1) {
            const [[, val]] = value;
            return val;
        }

        return "";
    }

    const getValues = () =>
        props.values.map(([, value]) => value);

    return (
        <FormControl variant="outlined" sx={{
            margin: theme.spacing(1),
            minWidth: 150,
        }}>
            <Autocomplete
                id={props.fieldName}
                name={props.fieldName}
                fullWidth
                freeSolo
                sx={{
                    minWidth: theme.spacing(10)
                }}
                value={getValue()}
                onChange={onChanged}
                options={getValues()}
                // error={props.formik.touched[props.fieldName] && Boolean(props.formik.errors[props.fieldName])}
                renderInput={params => <TextField {...params} label={props.label} />}>
            </Autocomplete>
        </FormControl>
    );
}

export default FormAutocompleteField;
