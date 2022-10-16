// @flow

import React from "react";
import Grid from "@mui/material/Grid";
import AttributeStat from "../../controls/AttributeStat";
import AttributeWithDamageStat from "../../controls/AttributeWithDamageStat";
import AttributeCumulativeStat from "../../controls/AttributeCumulativeStat";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import {characterIsVampire} from "../../../../_base/utils";
import {defaultFormatDateAndTime} from "../../../../_base/date-utils";
import type {GenericReactComponent} from "../../../../_base/types";
import {useCustomLazyLoadQuery} from "../../../../_base/relay-utils";
import {getCharacterStatusQuery} from "../../../../services/queries/character/GetCharacterStatusQuery";
import type {Character} from "../../../../services/queries/character/GetCharacterCompleteQuery";

type Props = {
    sheet: Character;
}

type CharacterSheetStatusStatsSectionInternalProps = {
    sheet: Character;
    characterId: string;
}

const CharacterSheetStatusStatsSection = ({sheet}: Props): GenericReactComponent => {
    if (sheet?.id != null) {
        return (
            <CharacterSheetStatusStatsSectionInternal sheet={sheet}
                                                      characterId={sheet.id} />
        );
    }

    return (<></>);
};

const CharacterSheetStatusStatsSectionInternal = (
    {sheet, characterId}: CharacterSheetStatusStatsSectionInternalProps
): GenericReactComponent => {
    const characterStatus = useCustomLazyLoadQuery(getCharacterStatusQuery, {characterId}, {
        fetchPolicy: "network-only"
    })?.getCharacterStatus;

    const isCharacterVampire = () => characterIsVampire(sheet);

    const resonanceIntensityLabel = (resonancePower: number) => {
        switch (resonancePower) {
            case 2: return "fugace";
            case 3: return "intensa";
            case 4: return "acuta (discrasia)";
            default: return "trascurabile";
        }
    };

    const showHuntResult = () => {
        if (isCharacterVampire) {
            const lastHuntDate = defaultFormatDateAndTime(characterStatus?.lastHunt ?? "");
            if (lastHuntDate != null && lastHuntDate !== "") {
                return (
                    <Grid item xs={12} sx={{
                        margin: "10px"
                    }}>
                        <Paper variant="outlined" sx={{padding: "10px", margin: "10px"}}>
                            <Typography sx={{
                                fontFamily: "DefaultTypewriter"
                            }}>
                                L'ultima caccia risale al {defaultFormatDateAndTime(characterStatus?.lastHunt ?? "")},
                                ha avuto una
                                risonanza <b>{characterStatus?.lastResonance} {resonanceIntensityLabel(characterStatus?.lastResonanceIntensity ?? 1)}</b>.
                            </Typography>
                        </Paper>
                    </Grid>
                );
            }

            return (<></>);
        }

        return (<></>)
    };

    const showHunger = () => {
        if (isCharacterVampire) {
            return (
                <Grid item xs={12}>
                    <AttributeStat stat={{
                        name: "Fame",
                        value: characterStatus?.hunger,
                        maxValue: 5
                    }} damage={characterStatus?.stains} />
                </Grid>
            );
        }

        return (<></>);
    };

    const showBloodPotency = () => {
        if (isCharacterVampire) {
            return (
                <Grid item xs={12}>
                    <AttributeStat stat={{
                        name: "Potenza del Sangue",
                        value: characterStatus?.bloodPotency,
                        maxValue: 5
                    }} damage={0} />
                </Grid>
            );
        }

        return (<></>);
    };

    return (
        <>
            {showHuntResult()}
            <Grid item xs={12}>
                <AttributeWithDamageStat stat={{
                    name: "Forza di Volontà",
                    value: characterStatus?.willpower,
                    maxValue: 10
                }} damage={characterStatus?.willpowerDamage ?? 0} />
            </Grid>
            <Grid item xs={12}>
                <AttributeWithDamageStat stat={{
                    name: "Salute",
                    value: characterStatus?.health,
                    maxValue: 10
                }} damage={characterStatus?.aggravatedDamage ?? 0} secondDamage={characterStatus?.damage ?? 0} />
            </Grid>
            <Grid item xs={12}>
                <AttributeCumulativeStat stat={{
                    name: "Umanità",
                    value: characterStatus?.humanity,
                    maxValue: 10
                }} damage={characterStatus?.stains ?? 0} />
            </Grid>
            {showBloodPotency()}
            {showHunger()}
        </>
    );
}

export default CharacterSheetStatusStatsSection;
