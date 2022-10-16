// @flow

import React from "react";
import {object, ref, string} from 'yup';
import {useFormik} from "formik";
import {useRelayEnvironment} from "react-relay";
import FormTextField from "../../_base/components/FormTextField";
import Button from "@mui/material/Button";
import {useTheme} from "@mui/material/styles";
import ChangeUserPasswordMutation from "../../services/mutations/sessions/ChangeUserPasswordMutation";
import type {GenericReactComponent} from "../../_base/types";
import {useCustomSnackbar} from "../../_base/notification-utils";
import {useWait} from "../../_base/providers/BackdropProvider";

type SubmitProps = {
    oldPassword: string;
    newPassword: string;
    repeatPassword: string;
}

const SignUpSchema = object().shape({
    oldPassword: string("La tua vecchia passwod").required("Required"),
    newPassword: string("Enter your password")
        .min(8, "The password should be at least 8 characters long")
        .max(20, "The password should be no more than 20 characters long")
        .required("Required"),
    repeatPassword: string("Enter your password")
        .min(8, "The password should be at least 8 characters long")
        .max(20, "The password should be no more than 20 characters long")
        .oneOf([ref("newPassword"), null], "The two password don't match.")
        .required("Required")
});

const SetNewPassword = (): GenericReactComponent => {
    const theme = useTheme()
    const environment = useRelayEnvironment()
    const {startWait, stopWait} = useWait()
    const {enqueueSnackbar} = useCustomSnackbar()

    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            repeatPassword: ""
        },
        validationSchema: SignUpSchema,
        onSubmit: v => onSubmit(v)
    });

    const onSubmit = ({
                          oldPassword,
                          newPassword,
                          repeatPassword
                      }: SubmitProps) => {
        startWait()

        ChangeUserPasswordMutation(environment,
            oldPassword,
            newPassword,
            repeatPassword)
            .then(response => {
                if (response === true) {
                    enqueueSnackbar({type: "success", message: "La tua password è stata correttamente resettata."});
                }
                else {
                    enqueueSnackbar({type: "warning", message: "Il cambio di password non è andato a buon fine, contatta un master per aiuto."});
                }
            })
            .catch(errors => {
                enqueueSnackbar({ type: 'error', graphqlError: errors, message: "Username or password invalid." });
            })
            .finally(() => stopWait());
    };

    return (
        <>
            <form style={{
                width: '100%', // Fix IE 11 issue.
                marginTop: "10px",
            }} noValidate onSubmit={formik.handleSubmit}>
                <FormTextField formik={formik} fieldName="oldPassword" label="Vecchia Password" type="password" />
                <FormTextField formik={formik} fieldName="newPassword" label="Nuova Password" type="password" />
                <FormTextField formik={formik} fieldName="repeatPassword" label="Ripeti Password" type="password" />
                <Button type="submit"
                        fullWidth
                        variant="outlined"
                        sx={{
                            margin: theme.spacing(3, 0, 2),
                        }}>
                    Cambia password
                </Button>
            </form>
        </>
    );
}

export default SetNewPassword;
