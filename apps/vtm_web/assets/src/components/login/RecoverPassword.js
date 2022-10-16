// @flow

import React from "react";
import {object, string} from "yup";
import {useHistory} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import {useFormik} from "formik";
import FormTextField from "../../_base/components/FormTextField";
import Button from "@mui/material/Button";
import {requestNewPassword} from "../../services/login-service";
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LoginFrameLayout from "./LoginFrameLayout";
import {LoginRoutes} from "./LoginRouter";
import ButtonGroup from "@mui/material/ButtonGroup";
import {Routes} from "../../AppRouter";
import Box from "@mui/material/Box";
import {menuIconStyle} from "../_layout/menu/menu-base-utils";
import type {GenericReactComponent} from "../../_base/types";
import {useWait} from "../../_base/providers/BackdropProvider";
import {useCustomSnackbar} from "../../_base/notification-utils";

type SubmitProps = {
    email: string;
}

const RecoverPasswordSchema = object().shape({
    email: string("Enter your email")
        .email("Invalid name")
        .required("Required")
});

const RecoverPassword = (): GenericReactComponent => {
    const history = useHistory();
    const theme = useTheme();
    const {startWait, stopWait} = useWait()
    const {enqueueSnackbar} = useCustomSnackbar()

    const formik = useFormik({
        initialValues: {
            email: ""
        },
        validationSchema: RecoverPasswordSchema,
        onSubmit: v => onSubmit(v)
    });

    const onSubmit = ({email}: SubmitProps) => {
        startWait()

        requestNewPassword(email)
            .then(_r => {
                enqueueSnackbar({
                    type: "success",
                    message: "Password ristabilita, controlla la tua mail!"
                });
                history.push(LoginRoutes.login);
            })
            .catch(e => {
                console.error("error while retrieving the password", e);
                enqueueSnackbar({
                    type: "error",
                    message: "Non è stato possibile resettare la password, sei sicuro di aver usato questo indirizzo di posta?"
                })
            })
            .finally(() => stopWait());
    }

    return (
        <LoginFrameLayout title="Recupera la tua password" icon={<ContactMailIcon sx={menuIconStyle} />}>
            <>
                <form style={{
                    width: '100%', // Fix IE 11 issue.
                    marginTop: "10px",
                }} noValidate onSubmit={formik.handleSubmit}>
                    <FormTextField formik={formik} fieldName="email" label="Email" type="email" />
                    <Button type="submit"
                            fullWidth
                            variant="outlined"
                            sx={{
                                margin: theme.spacing(3, 0, 2),
                            }}>
                        Recupera la tua password!
                    </Button>
                </form>
                <Box component="div" sx={{textAlign: "center"}}>
                    <ButtonGroup variant="outlined" aria-label="recover password links">
                        <Button onClick={_ => history.push(LoginRoutes.login)}>Torna al Login</Button>
                        <Button onClick={_ => history.push(Routes.guideMain)}>Guida</Button>
                        <Button onClick={_ => history.push(LoginRoutes.register)}>Registrazione</Button>
                    </ButtonGroup>
                </Box>
            </>
        </LoginFrameLayout>
    );
}

export default RecoverPassword;
