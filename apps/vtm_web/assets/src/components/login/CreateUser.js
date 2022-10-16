// @flow

import type {Node} from "react";
import React, {useRef} from "react";
import Button from "@mui/material/Button";
import createUser from "../../services/mutations/sessions/CreateUserMutation";
import {object, string} from 'yup';
import {useFormik} from "formik";
import FormTextField from "../../_base/components/FormTextField";
import {Link, useHistory} from "react-router-dom";
import {Routes} from "../../AppRouter";
import {useTheme} from "@mui/material/styles";
import {useRelayEnvironment} from "react-relay";
import {userNameExists} from "../../services/queries/accounts/UserNameExistsQuery";
import {userEmailExists} from "../../services/queries/accounts/UserEmailExistsQuery";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Checkbox from '@mui/material/Checkbox';
import Typography from "@mui/material/Typography";
import {FormControl} from "@mui/material";
import Box from "@mui/material/Box";
import LoginFrameLayout from "./LoginFrameLayout";
import {LoginRoutes} from "./LoginRouter";
import ButtonGroup from "@mui/material/ButtonGroup";
import {menuIconStyle} from "../_layout/menu/menu-base-utils";
import {useCustomSnackbar} from "../../_base/notification-utils";
import {useWait} from "../../_base/providers/BackdropProvider";

type CheckerFunction = string => Promise<boolean>;

const SignUpSchema = (nameChecker: CheckerFunction, emailChecker: CheckerFunction) =>
    object().shape({
        email: string("Enter your email")
            .email("Invalid name")
            .required("Required")
            .test("checkEmailUnique", "Questo indirizzo email è già stato usato.", emailChecker),
        name: string("Enter your name")
            .required("Required")
            .test("checkUsernameUnique", "Questo nome è già stato usato.", nameChecker)
    });

const CreateUserComponent = (): Node => {
    const history = useHistory()
    const theme = useTheme()
    const environment = useRelayEnvironment()
    const {enqueueSnackbar} = useCustomSnackbar()
    const {startWait, stopWait} = useWait()

    const checkBoxRef = useRef();

    const checkUsername = (name: string) =>
        new Promise((res, rej) => {
            if (name != null && name !== "") {
                userNameExists(environment, name)
                    .then(r => res(r === false))
                    .catch(e => rej(e));
            }
            else {
                res(false);
            }
        });

    const checkEmail = (email: string) =>
        new Promise((res, rej) => {
            if (email != null && email !== "") {
                userEmailExists(environment, email)
                    .then(r => res(r === false))
                    .catch(e => rej(e));
            }
            else {
                res(false);
            }
        });

    const formik = useFormik({
        initialValues: {
            email: "",
            name: ""
        },
        validationSchema: SignUpSchema(checkUsername, checkEmail),
        // Validating on change would mean calling the back end every time the name changes.
        validateOnChange: false,
        validateOnBlur: true,
        onSubmit: v => onSubmit(v)
    });

    const onSubmit = ({
        email,
        name
    }) => {
        if (!checkBoxRef.current?.firstChild?.checked === true) {
            enqueueSnackbar({
                type: "warning",
                message: "Devi dichiarare di aver letto il Disclaimer prima di accedere al sito."
            });
            return;
        }

        startWait()

        createUser(environment, {
            email,
            name
        })
            .then((_: any) => {
                enqueueSnackbar({
                    type: "success",
                    message: "L'utente è stato creato correttamente, controlla la mail (spam incluso) per avere la tua prima password."
                });
                setTimeout(() => history.push(LoginRoutes.login), 2000);
            })
            .catch(errors => {
                enqueueSnackbar({
                    type: 'error',
                    graphqlError: errors,
                    message: "C'è stato un errore durante la creazione del personaggio, contatta un master per informazioni."
                });
            })
            .finally(() => stopWait());
    }

    return (
        <LoginFrameLayout title="Registrazione" icon={<AddCircleOutlineIcon sx={menuIconStyle} />}>
            <>
                <form style={{
                    width: '100%', // Fix IE 11 issue.
                    marginTop: "10px",
                }} noValidate onSubmit={formik.handleSubmit}>
                    <FormTextField formik={formik} fieldName="email" label="Email" type="email" />
                    <FormTextField formik={formik} fieldName="name" label="Name" />
                    <Box component="div" sx={{paddingTop: "10px"}}>
                        <FormControl component="div">
                            <Checkbox ref={checkBoxRef} />
                        </FormControl>
                        <Box component="div" sx={{height: "40px", display: "inline-flex"}}>
                            <Typography component="div" sx={{marginTop: "auto", marginBottom: "auto"}}>
                                Dichiaro di aver preso visione del <Link to={LoginRoutes.disclaimer} style={{color: "secondary.light"}}>Disclaimer</Link>
                            </Typography>
                        </Box>
                    </Box>
                    <Button type="submit"
                            fullWidth
                            variant="outlined"
                            sx={{
                                margin: theme.spacing(3, 0, 2),
                            }}>
                        Register!
                    </Button>
                </form>
                <Box component="div" sx={{textAlign: "center"}}>
                    <ButtonGroup variant="outlined" aria-label="registration links">
                        <Button onClick={_ => history.push(LoginRoutes.recoverPassword)}>Recupera Password</Button>
                        <Button onClick={_ => history.push(Routes.guideMain)}>Guida</Button>
                        <Button onClick={_ => history.push(LoginRoutes.login)}>Torna al Login</Button>
                    </ButtonGroup>
                </Box>
            </>
        </LoginFrameLayout>
    );
};

export default CreateUserComponent;
