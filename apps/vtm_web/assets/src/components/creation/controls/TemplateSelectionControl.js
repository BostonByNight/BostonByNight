// @flow

import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import {useTheme} from "@mui/material/styles";
import {useCustomLazyLoadQueryNoVar} from "../../../_base/relay-utils";
import {getCreationTemplateQuery} from "../../../services/queries/character/GetCreationTemplateQuery";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ApplyTemplateToCharacterMutation from "../../../services/mutations/characters/ApplyTemplateToCharacterMutation";
import {useRelayEnvironment} from "react-relay";
import {useHistory} from "react-router-dom";
import {MainRoutes} from "../../MainRouter";
import type {GenericReactComponent} from "../../../_base/types";
import {useWait} from "../../../_base/providers/BackdropProvider";
import {useCustomSnackbar} from "../../../_base/notification-utils";
import {useDialog} from "../../../_base/providers/DialogProvider";

type Props = {
    characterId: string;
}

const TemplateSelectionControl = ({characterId}: Props): GenericReactComponent => {
    const history = useHistory()
    const theme = useTheme()
    const {startWait, stopWait} = useWait()
    const {enqueueSnackbar} = useCustomSnackbar()
    const {showDialog} = useDialog()
    const environment = useRelayEnvironment()
    
    const templates = useCustomLazyLoadQueryNoVar(getCreationTemplateQuery)
        ?.getCreationTemplates ?? [];

    const [template, setTemplate] = useState<?string>(null);

    const items = () =>
        [(<MenuItem key="0" value={null}>None</MenuItem>)]
            .concat(templates.map(t => (
                <MenuItem key={t?.id} value={t?.id}>{t?.name}</MenuItem>
            )));

    const onTemplateSelectionChange = ({target: {value}}: GenericEvent) => {
        setTemplate(value);
    };

    const selectTemplate = () => {
        if (template == null || template === "") {
            enqueueSnackbar({
                type: "warning",
                message: "Devi prima selezionare un template."
            });
        }
        else {
            showDialog("Applicazione del template", "Sei sicuro di voler applicare il template la tuo personaggio?", () => {
                startWait()
                ApplyTemplateToCharacterMutation(environment, characterId, template)
                    .then(response => {
                        if (!response) {
                            enqueueSnackbar({
                                type: "warning",
                                message: "C'è stato un problema nell'applicazione del template, prova ad aggiorare la pagina"
                            });
                        }
                        else {
                            history.push(MainRoutes.creation4);
                        }
                    })
                    .catch(e => {
                        console.error("There was an error while saving the character", e);
                        enqueueSnackbar({
                            type: "error",
                            message: "C'è stato un problema nell'applicazione del template, prova ad aggiorare la pagina"
                        });
                    })
                    .finally(() => stopWait());
            })
        }
    }

    return (
        <Grid container sx={{
            textAlign: "center"
        }}>
            <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" sx={{
                    margin: theme.spacing(1),
                    minWidth: 150
                }}>
                    <InputLabel id="template-label">Templates</InputLabel>
                    <Select labelId="template-label"
                            label="Templates"
                            fullWidth
                            onChange={onTemplateSelectionChange}
                            sx={{
                                minWidth: theme.spacing(10)
                            }}>
                        {items()}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} sx={{display: "inline-flex"}}>
                <Button variant="outlined"
                        onClick={selectTemplate}
                        sx={{marginTop: "auto", marginBottom: "auto"}}>
                    Seleziona template
                </Button>
            </Grid>
        </Grid>
    );
}

export default TemplateSelectionControl;
