// @flow

import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import {predatorTypesQuery} from "../../../services/queries/info/PredatorTypesQuery";
import type {
    PredatorTypesQuery$data
} from "../../../services/queries/info/__generated__/PredatorTypesQuery.graphql";
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import {characterIsVampire} from "../../../_base/utils";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";
import {GuideRoutes} from "../../guides/GuidesMain";
import type {
    CharacterFragments_characterConcealedInfo$data
} from "../../../services/queries/character/__generated__/CharacterFragments_characterConcealedInfo.graphql";
import type {GenericReactComponent} from "../../../_base/types";

type Props = {
    characterInfo: CharacterFragments_characterConcealedInfo$data;
    classes: any;
    formik: any;
}

const PredatorTypeControl = ({characterInfo, classes, formik}: Props): GenericReactComponent => {
    const {predatorTypes}: PredatorTypesQuery$data = useCustomLazyLoadQuery(predatorTypesQuery, {});

    const showPredatorTypes = () => {
        const options = [<MenuItem key="None" value="">None</MenuItem>];

        if (predatorTypes && predatorTypes.length > 0) {
            return [...options, ...predatorTypes.map(d => <MenuItem key={d?.id} value={d?.id}>{d?.name}</MenuItem>)];
        }

        return options;
    }

    const predatorTypeSelector = () => {
        if (characterIsVampire(characterInfo)) {
            return (
                <>
                    <Grid item xs={12}>
                        <Typography paragraph sx={{marginTop: "1.5rem", marginBottom: "1.5rem"}}>
                            Il Tipo di Predatore &egrave; una nuova caratteristica
                            del personaggio che interessa il modo in cui caccia il Sangue dei mortali (o dei Cainiti).
                            Puoi trovare pi&ugrave; informazioni riguardo il significato e i vari tipi tra i quali
                            puoi scegliere nella <Link to={GuideRoutes.creation}
                                                       target="_blank"
                                                       rel="noreferrer">Guida</Link>.<br />
                            Scegli il tipo di predatore che il tuo personaggio dovr&agrave; interpretare.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{textAlign: "center", marginBottom: "1rem"}}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="predator-type-label">Tipo di Predatore</InputLabel>
                            <Select labelId="predator-type-label"
                                    id="predatorType"
                                    name="predatorType"
                                    value={formik.values["predatorType"]}
                                    label="Tipo di Predatore"
                                    onChange={formik.handleChange}
                                    error={formik.touched["predatorType"] && Boolean(formik.errors["predatorType"])}
                                    style={{width: "200px"}}>
                                {showPredatorTypes()}
                            </Select>
                        </FormControl>
                    </Grid>
                </>
            )
        }

        return <></>;
    }

    return predatorTypeSelector();
}

export default PredatorTypeControl;
