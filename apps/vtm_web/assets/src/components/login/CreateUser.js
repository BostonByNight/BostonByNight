// @flow

import React, {useContext} from "react";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import createUser from "../../services/mutations/sessions/CreateUserMutation";
import LoginLayout from "./LoginLayout";
import { object, string, ref } from 'yup';
import { useFormik } from "formik";
import FormTextField from "../../_base/components/FormTextField";
import {Link, useHistory} from "react-router-dom";
import type { Node } from "react";
import {Routes} from "../../AppRouter";
import {UtilityContext} from "../../App";

const SignUpSchema = object().shape({
    email: string("Enter your email")
        .email("Invalid name")
        .required("Required"),
    name: string("Enter your name").required("Required"),
    password: string("Enter your password")
        .min(8, "The password should be at least 8 characters long")
        .max(20, "The password should be no more than 20 characters long")
        .required("Required"),
    repeatpassword: string("Enter your password")
        .min(8, "The password should be at least 8 characters long")
        .max(20, "The password should be no more than 20 characters long")
        .oneOf([ref("password"), null], "The two password don't match.")
        .required("Required")
});

const CreateUserComponent = (): Node => {
    const history = useHistory();

    const { setError } = useContext(UtilityContext);

    const formik = useFormik({
        initialValues: {
            email: "",
            name: "",
            password: "",
            repeatpassword: ""
        },
        validationSchema: SignUpSchema,
        onSubmit: v => onSubmit(v)
    });

    const onSubmit = ({
        email,
        name,
        password,
        _repeatpassword
    }) => {
        createUser(email, password, name)
            .then(_ => {
                setError({ type: "success", message: "User created successfully."});
                setTimeout(() => history.push(Routes.login), 2000);
            })
            .catch(errors => {
                setError({ type: 'error', graphqlError: errors, message: "Username or password invalid." });
            });
    }

    return (
        <LoginLayout title="Register">
            { classes => 
                <>
                    <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
                        <FormTextField formik={formik} fieldName="email" label="Email" />
                        <FormTextField formik={formik} fieldName="name" label="Name" />
                        <FormTextField formik={formik} fieldName="password" label="Password" type="password" />
                        <FormTextField formik={formik} fieldName="repeatpassword" label="Repeat Password" type="password" />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}>
                            Register!
                        </Button>
                    </form>
                    <Grid container>
                        <Grid item xs>
                            <Link to="#" variant="body2" className={classes.link}>
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to="/" variant="body2" className={classes.link}>
                                Return to Login
                            </Link>
                        </Grid>
                    </Grid>
                </>
            }
        </LoginLayout>);
};

export default CreateUserComponent;