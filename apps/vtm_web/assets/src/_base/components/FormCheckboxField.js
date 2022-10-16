// @flow

import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import type {Formik} from "./FormTypes";
import type {GenericEvent, GenericReactComponent} from "../types";
import FormHelperText from "@mui/material/FormHelperText";

type Props = {
    formik: Formik,
    fieldName: string,
    label: string,
    onChanged?: boolean => void
}

const FormCheckboxField = ({formik, fieldName, label, onChanged}: Props): GenericReactComponent => {
    const [checked, setChecked] = React.useState<boolean>(formik.values[fieldName] === true);

    const onControlChanged = (e: GenericEvent) => {
        setChecked(e.target.checked);

        e.target.value = e.target.value === "on";

        formik.handleChange(e);

        if (onChanged != null) {
            onChanged(e.target.checked);
        }
    }

    return (
        <FormGroup row>
            <FormControlLabel
                control={
                    <Checkbox onChange={onControlChanged}
                              checked={checked}
                              name={fieldName}
                              id={fieldName}
                              color="primary" />
                }
                label={label} />
            <FormHelperText sx={{color: "red"}}>{formik.errors[fieldName]}</FormHelperText>
        </FormGroup>
    );
}

export default FormCheckboxField;
