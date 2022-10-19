// @flow

import React from "react";
import type {GenericReactComponent} from "../../_base/types";
import {useRecoilValue} from "recoil";
import {sessionCharacterStateAtom} from "../../session/atoms";
import {useCustomLazyLoadQuery} from "../../_base/relay-utils";
import {getCharacterTransactionsQuery} from "../../services/queries/transactions/GetCharacterTransactionsQuery";
import Stack from "@mui/material/Stack";
import {getCharacterStatusQuery} from "../../services/queries/character/GetCharacterStatusQuery";
import Button from "@mui/material/Button";
import {useTheme} from "@mui/material/styles";
import {useHistory} from "react-router-dom";
import {MainRoutes} from "../MainRouter";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";

type Props = {
    characterId: string;
}

const Internal = ({characterId}: Props) => {
    const theme = useTheme()
    const history = useHistory()
    const character = useCustomLazyLoadQuery(getCharacterStatusQuery, {characterId})?.getCharacterStatus
    const transactions = useCustomLazyLoadQuery(getCharacterTransactionsQuery, {characterId})?.getCharacterTransactions;

    const showTransactions = () => {
        if (transactions) {
            return transactions?.map((transaction) => (
                <TableRow
                    key={transaction?.id}
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                    <TableCell component="th" scope="row">
                        {transaction?.characterName}
                    </TableCell>
                    <TableCell>
                        {transaction?.toCharacterName}
                    </TableCell>
                    <TableCell align="right">
                        {transaction?.amount}
                    </TableCell>
                </TableRow>
            ))
        }

        return (<></>)
    }

    const addNewTransaction = () => {
        history.push(MainRoutes.newTransaction)
    }

    return (
        <Stack direction="column"
               style={{
                   justifyContent: "space-evenly"
               }}>
            <h1>
                Transazioni Bancarie
            </h1>

            <div>
                <Button fullWidth
                        variant="outlined"
                        color="primary"
                        type="submit"
                        onClick={addNewTransaction}
                        sx={{
                            margin: theme.spacing(3, 0, 2),
                        }}>
                    Nuova Transazione
                </Button>
            </div>

            <div style={{
                paddingTop: "1rem",
                paddingBottom: "1rem"
            }}>
                Denaro disponibile: $ {character?.money ?? 0}
            </div>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Proprietario del Conto</TableCell>
                            <TableCell>Beneficiario</TableCell>
                            <TableCell align="right">Importo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {showTransactions()}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
};

const TransactionsList = (): GenericReactComponent => {
    const character = useRecoilValue(sessionCharacterStateAtom);

    if (character?.id != null) {
        return (
            <Internal characterId={character.id}/>
        )
    }

    return (<></>)
}

export default TransactionsList;
