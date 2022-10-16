// @flow

import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import {mainFontFamily} from "../../Main.Layout.Style";
import {useTheme} from "@mui/material/styles";
import type {Attribute} from "../../../services/queries/character/GetCharacterStatsQuery";
import {
    characterAttributeSorter,
    useCharacterStatsQuery,
} from "../../../services/queries/character/GetCharacterStatsQuery";
import AttributeFormControl from "./AttributeFormControl";
import Button from "@mui/material/Button";
import {emptyArray, handleMutation} from "../../../_base/utils";
import AssignNpcAttributesMutation from "../../../services/mutations/npcs/AssignNpcAttributesMutation";
import {useRelayEnvironment} from "react-relay";
import type {GenericReactComponent} from "../../../_base/types";
import {useCustomSnackbar} from "../../../_base/notification-utils";

type Props = {
    characterId: string;
}

const AssignNpcAttributes = ({characterId}: Props): GenericReactComponent => {
    const environment = useRelayEnvironment();
    const {enqueueSnackbar} = useCustomSnackbar()
    const theme = useTheme();
    const stats = useCharacterStatsQuery(characterId, {
        fetchPolicy: "network-only"
    })?.attributes ?? emptyArray<Attribute>();

    const [savedStats, setSavedStats] = useState<Array<Attribute>>(stats);

    const subTitleStyle = ({
        ...mainFontFamily,
        textAlign: "center",
        fontSize: theme.spacing(2)
    });

    const titleStyle = ({
        ...subTitleStyle,
        color: "secondary.light",
        fontSize: theme.spacing(3),
        margin: "10px"
    });

    const onAttributeChanged = (a: Attribute) =>
        setSavedStats(p => p?.reduce((acc, current) =>
            current.id === a.id
                ? [...acc, a]
                : [...acc, current], []));

    const onSave = () => {
        const attributes = savedStats.map(({id, value}) => ({id: ((id: any): string), value: Number(value)}));

        handleMutation(() => AssignNpcAttributesMutation(environment, characterId, {
            attributes: attributes
        }), enqueueSnackbar, {});
    };

    const filterAttributes = (type: "Attribute" | "Ability", section: "Physical" | "Social" | "Mental") => stats
        ?.filter(({type: t, section: s}) => t === type && s === section)
        ?.sort((a, b) => characterAttributeSorter(type)(a, b))
        ?.map(s => (<AttributeFormControl characterId={characterId}
                                          attribute={s}
                                          onChange={onAttributeChanged}
                                          maxValue={5} />));

    return (
        <Grid container>
            <Grid item xs={12} sx={titleStyle}>
                Attributi
            </Grid>
            <Grid item xs={12} md={4}>
                {filterAttributes("Attribute", "Physical")}
            </Grid>
            <Grid item xs={12} md={4}>
                {filterAttributes("Attribute", "Social")}
            </Grid>
            <Grid item xs={12} md={4}>
                {filterAttributes("Attribute", "Mental")}
            </Grid>
            <Grid item xs={12} sx={titleStyle}>
                Abilità
            </Grid>
            <Grid item xs={12} md={4}>
                {filterAttributes("Ability", "Physical")}
            </Grid>
            <Grid item xs={12} md={4}>
                {filterAttributes("Ability", "Social")}
            </Grid>
            <Grid item xs={12} md={4}>
                {filterAttributes("Ability", "Mental")}
            </Grid>
            <Grid item xs={12} sx={{
                textAlign: "center",
                padding: theme.spacing(3)
            }}>
                <Button type="submit"
                        variant="outlined"
                        color="primary"
                        onClick={_ => onSave()}>
                    Salva
                </Button>
            </Grid>
        </Grid>
    );
}

export default AssignNpcAttributes;
