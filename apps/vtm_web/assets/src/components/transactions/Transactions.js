// @flow

import React from "react";
import Stack from "@mui/material/Stack";
import {number, object, string} from "yup";
import {useCustomLazyLoadQuery} from "../../_base/relay-utils";
import {useRecoilValue} from "recoil";
import {sessionCharacterStateAtom} from "../../session/atoms";
import {getCharacterStatusQuery} from "../../services/queries/character/GetCharacterStatusQuery";
import {useFormik} from "formik";
import CharactersSelectControl from "../_base/CharactersSelectControl";
import Grid from "@mui/material/Grid";
import FormTextField from "../../_base/components/FormTextField";
import Button from "@mui/material/Button";
import {useTheme} from "@mui/material/styles";
import type {GenericReactComponent} from "../../_base/types";
import {useWait} from "../../_base/providers/BackdropProvider";
import performTransactionMutation from "../../services/mutations/transactions/PerformTransactionMutation";
import {useRelayEnvironment} from "react-relay";
import {useCustomSnackbar} from "../../_base/notification-utils";
import {useHistory} from "react-router-dom";
import {MainRoutes} from "../MainRouter";

const TransactionSchema = (money: number) => object().shape({
    toCharacterId: string("Beneficiario").required("Obbligatorio"),
    amount: number("Ammontare")
        .required("Obbligatorio")
        .max(money, "Non hai abbastanza soldi"),
    reason: string("Causale")
})

type Props = {
    characterId: string;
}

type SubmitProperties = {
    toCharacterId: string;
    amount: number;
    reason: string;
}

const Internal = ({characterId}: Props) => {
    const history = useHistory()
    const {startWait, stopWait} = useWait()
    const {enqueueSnackbar} = useCustomSnackbar()
    const environment = useRelayEnvironment()
    const theme = useTheme()
    const character = useCustomLazyLoadQuery(getCharacterStatusQuery, {characterId})?.getCharacterStatus

    const onSubmit = ({
                          toCharacterId,
                          amount,
                          reason
                      }: SubmitProperties) => {
        startWait()

        performTransactionMutation(environment, {
            characterId,
            toCharacterId,
            amount,
            reason
        }).then(_ => {
            console.debug("passing 2")
            enqueueSnackbar({
                type: "info",
                message: "Transazione effettuata con successo"
            });
        }).catch(e => {
            console.error("There was an error while performing the transaction.", e)
            enqueueSnackbar({
                type: "error",
                message: "C'è stato un errore nel registrare la transazione. Contatta un master per maggior informazioni."
            });
        }).finally(() => {
            stopWait()
            history.push(MainRoutes.listTransactions)
        })
    }

    const formik = useFormik({
        validationSchema: TransactionSchema(character?.money || 0),
        initialValues: {
            toCharacterId: undefined,
            amount: 3000,
            reason: "Test message"
        },
        onSubmit
    });

    return (
        <Stack direction="column">
            <h1>
                Transazioni Bancarie
            </h1>

            <div>
                Denaro disponibile: $ {character?.money ?? 0}
            </div>

            <form onSubmit={formik.handleSubmit}>
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <CharactersSelectControl label="Beneficiario"
                                                 fieldName="toCharacterId"
                                                 formik={formik} />
                    </Grid>
                    <Grid item xs={12}>
                        <FormTextField formik={formik}
                                       fieldName="amount"
                                       type="number"
                                       label="Ammontare" />
                    </Grid>
                    <Grid item xs={12}>
                        <FormTextField formik={formik}
                                       fieldName="reason"
                                       label="Testo del messaggio" />
                    </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth
                                variant="outlined"
                                color="primary"
                                type="submit"
                                sx={{
                                    margin: theme.spacing(3, 0, 2),
                                }}>
                            Conferma
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Stack>
    );
}

const Transactions = (): GenericReactComponent => {
    const character = useRecoilValue(sessionCharacterStateAtom);

    if (character?.id != null) {
        return (
            <Internal characterId={character.id}/>
        )
    }

    return (<></>)
}

export default Transactions;
