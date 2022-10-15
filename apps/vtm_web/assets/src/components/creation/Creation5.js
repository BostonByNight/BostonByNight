// @flow

import React, {Suspense, useCallback, useState} from "react";
import CharacterProvider from "../_data/CharacterProvider";
import type {RefreshedQueryOption} from "../character/sheet-sections/sections/CharacterSheetStatsSection";
import CharacterSheetStatsSection from "../character/sheet-sections/sections/CharacterSheetStatsSection";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import AttributeSwitchControl from "../character/controls/AttributeSwitchControl";
import useAttributesSlimQuery from "../../services/queries/info/AttributesSlimQuery";
import switchCharacterAttributeMutation from "../../services/mutations/characters/SwitchCharacterAttributeMutation";
import {useRelayEnvironment} from "react-relay";
import {useTheme} from "@mui/material/styles";
import Button from "@mui/material/Button";
import FinalizeCharacterMutation from "../../services/mutations/characters/FinalizeCharacterMutation";
import {useHistory} from "react-router-dom";
import {Routes} from "../../AppRouter";
import DeleteCharacterMutation from "../../services/mutations/characters/DeleteCharacterMutation";
import CharacterFragmentProvider from "../_data/CharacterFragmentProvider";
import {sortAttributes} from "../../_base/info-helpers";
import type {AttributeTypeNames} from "../../services/queries/info/AttributesQuery";
import {useWait} from "../../_base/providers/BackdropProvider";
import {useCustomSnackbar} from "../../_base/notification-utils";
import {useDialog} from "../../_base/providers/DialogProvider";

type Props = {

};

const Internal = ({character}) => {
    const theme = useTheme();
    const {startWait, stopWait} = useWait()
    const {enqueueSnackbar} = useCustomSnackbar()
    const {showDialog} = useDialog()
    const environment = useRelayEnvironment();
    const attributes = useAttributesSlimQuery();
    const history = useHistory();

    const [refreshedQueryOptions, setRefreshedQueryOptions] = useState<?RefreshedQueryOption>(null);
    
    const refresh = useCallback(() => {
        setRefreshedQueryOptions(previous => ({
            fetchKey: (previous?.fetchKey ?? 0) + 1,
            fetchPolicy: "network-only"
        }));
    }, []);

    const filterAttrs = (type: AttributeTypeNames): Array<[string, string]> => attributes
        ?.filter(a => a?.attributeType?.name === type)
        ?.sort((a, b) => sortAttributes(type)(a, b))
        ?.map(a => [String(a?.id), String(a?.name)]) ?? [];

    const getAttributes = () => filterAttrs("Attribute");

    const getSkills = () => filterAttrs("Ability");

    const switchCharacterAttributes = ({
        characterId: id,
        firstAttribute: first,
        secondAttribute: second
                                       }) => {
        startWait()

        switchCharacterAttributeMutation(environment, {
            characterId: id,
            firstAttribute: first,
            secondAttribute: second
        })
            .then(r => {})
            .catch(e => {
                enqueueSnackbar({
                    type: "error",
                    graphqlError: e,
                    message: "C'e' stato un errore nella gestione della richiesta."
                });
            })
            .finally(() => {
                stopWait()
                refresh();
            });
    }

    const completeCharacter = (characterId: string) => {
        showDialog("Conferma personaggio", "Sei sicuro di voler confermare il personaggio?", () => {
            FinalizeCharacterMutation(environment, characterId)
                .then(r => {
                    enqueueSnackbar({type: "success", message: "Il tuo personaggio è stato creato con successo!"})
                    setTimeout(() => {
                        history.push(Routes.map);
                        setTimeout(() => document.location.reload(false), 200);
                    }, 1000);
                })
                .catch(e => {
                    enqueueSnackbar({
                        type: "error",
                        graphqlError: e,
                        message: "C'è stato un errore durante la finalizzazione del personaggio."
                    })
                });
        });
    }

    const deleteCharacter = (characterId: string) => {
        showDialog("Conferma cancellazione", "Sei sicuro di voler cancellare il personaggio?", () => {
            DeleteCharacterMutation(environment, characterId)
                .then(r => {
                    enqueueSnackbar({type: "success", message: "Il tuo personaggio è stato cancellato!"});
                    history.push(Routes.map);
                    document.location.reload(false);
                })
                .catch(e => {
                    enqueueSnackbar({
                        type: "error",
                        graphqlError: e,
                        message: "C'è stato un errore durante la finalizzazione del personaggio."
                    })
                })
        });
    }

    if (character?.id != null) {
        return (
            <>
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <AttributeSwitchControl firstAttributeLabel="Primo Attributo"
                                                secondAttributeLabel="Secondo Attributo"
                                                values={getAttributes()}
                                                characterId={character.id}
                                                onChangeSelected={switchCharacterAttributes} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <AttributeSwitchControl firstAttributeLabel="Prima Abilità"
                                                secondAttributeLabel="Seconda Abilità"
                                                values={getSkills()}
                                                characterId={character.id}
                                                onChangeSelected={switchCharacterAttributes} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography xs={{padding: theme.spacing(2)}}>
                            Una volta finito, puoi schiacciare il bottone sottostante per confermare il personaggio.
                            Una volta confermato, sar&agrave; sottoposto all'attenzione dei master, che potranno accettare,
                            o proporre correzioni, al tuo personaggio.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{textAlign: "center", margin: "1rem"}}>
                        <Button
                            type="submit"
                            variant="outlined"
                            color="primary"
                            onClick={() => completeCharacter(character.id)}>
                            Conferma il personaggio!
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography sx={{padding: theme.spacing(2)}}>
                            Se non sei soddisfatto, e vuoi cominciare da capo, sentiti libero di cancellare il personaggio.
                            Avrai la possibilit&agrave; di farne un altro cliccando sull'icona personaggio in alto a destra.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{textAlign: "center", margin: "1rem"}}>
                        <Button
                            type="submit"
                            variant="outlined"
                            color="primary"
                            onClick={() => deleteCharacter(character.id)}>
                            Cancella il personaggio
                        </Button>
                    </Grid>
                </Grid>
                <Suspense fallback={"loading..."}>
                    <CharacterFragmentProvider characterId={character.id}
                                               showWarningWhenNoCharacterSelected={true}>
                        { ch =>
                            <CharacterSheetStatsSection characterId={character.id}
                                                        characterQuery={ch}
                                                        queryOptions={refreshedQueryOptions}
                                                        hideAdvantages
                                                        hideStatus />
                        }
                    </CharacterFragmentProvider>
                </Suspense>
            </>
        );
    }
    
    return (<></>);
}

const Creation5 = (_: Props): any => (
    <>
        <Typography>
            Complimenti! Hai inserito tutti i dati del tuo personaggio, adesso la tua scheda &egrave; pronta per poter essere approvata.
        </Typography>
        <Typography>
            Adesso puoi apportare modifiche alla tua scheda, ora che è completa. Puoi scambiare i valori tra attributi e abilit&agrave;.
            Per apportare altre modifiche, contatta un master.
        </Typography>
        <CharacterProvider showWarningWhenNoCharacterSelected={true}>
            { character =>
                <Internal character={character} />
            }
        </CharacterProvider>
    </>
);

export default Creation5;
