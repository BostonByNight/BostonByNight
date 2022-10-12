// @flow

import type {Node} from "react";
import React from "react";
import Button from "@mui/material/Button";
import {login} from "../../services/login-service";
import {useHistory} from "react-router-dom";
import {object, string} from 'yup';
import {useFormik} from "formik";
import FormTextField from "../../_base/components/FormTextField";
import {Routes} from "../../AppRouter";
import {useTheme} from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginFrameLayout from "./LoginFrameLayout";
import {LoginRoutes} from "./LoginRouter";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import {menuIconStyle} from "../_layout/menu/menu-base-utils";
import {useCustomSnackbar} from "../../_base/notification-utils";
import {useWait} from "../../_base/providers/BackdropProvider";
import {useSetRecoilState} from "recoil";
import {sessionStateAtom} from "../../session/atoms";

const SignInSchema = object().shape({
    email: string("Enter your email")
        .email("Invalid name")
        .required("Required"),
    password: string("Enter your password").required("Required"),
    // remember: bool("Remember me")
});

const LoginComponent = (): Node => {
    const history = useHistory()
    const theme = useTheme()
    const {enqueueSnackbar} = useCustomSnackbar()
    const {startWait, stopWait} = useWait()
    const setUser = useSetRecoilState(sessionStateAtom)
    
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            // remember: true
        },
        validationSchema: SignInSchema,
        onSubmit: v => onSubmit(v)
    });

    const onSubmit = ({
        email,
        password,
        // remember
    }) => {
        startWait()

        const handleUnhandledExceptionAtLogin = e => {
            stopWait()
            console.error("Unhandled error", e);
            enqueueSnackbar({type: 'error', message: "Username or password invalid."});
        };

        window.addEventListener("unhandledrejection", handleUnhandledExceptionAtLogin);

        login(email, password, true)
            .then(res => {
                stopWait()
                setUser(res.data.user);
                setTimeout(() => {
                    history.push(Routes.map);
                }, 200);
                return res;
            })
            .catch(errors => {
                stopWait()
                enqueueSnackbar({type: 'error', graphqlErrors: errors, message: "Username or password invalid."});
            })
            .finally(() => {
                window.removeEventListener("unhandledrejection", handleUnhandledExceptionAtLogin);
            });
    }

    return (
        <LoginFrameLayout title="Login" icon={<LockOutlinedIcon sx={menuIconStyle} />}>
            <form style={{
                width: '100%', // Fix IE 11 issue.
                marginTop: "10px",
            }} noValidate onSubmit={formik.handleSubmit}>
                <FormTextField formik={formik} fieldName="email" label="Email" type="email" />
                <FormTextField formik={formik} fieldName="password" label="Password" type="password" />
                {/*<FormCheckboxField formik={formik} fieldName="remember" label="Ricorda" />*/}
                <Button type="submit"
                        fullWidth
                        variant="outlined"
                        color="primary"
                        sx={{
                            margin: theme.spacing(3, 0, 2),
                        }}>
                    Accedi
                </Button>
            </form>
            <Box component="div" sx={{textAlign: "center"}}>
                <ButtonGroup variant="outlined" aria-label="login links">
                    <Button onClick={_ => history.push(LoginRoutes.recoverPassword)}>Recupera password</Button>
                    <Button onClick={_ => history.push(Routes.guideMain)}>Guida</Button>
                    <Button onClick={_ => history.push(LoginRoutes.register)}>Registrazione</Button>
                </ButtonGroup>
            </Box>
        </LoginFrameLayout>);
};

export default LoginComponent;
