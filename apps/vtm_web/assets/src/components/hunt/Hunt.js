// @flow

import React, {useState} from "react";
import HavenMap from "../_base/HavenMap";
import HuntMutation from "../../services/mutations/characters/HuntMutation";
import type {HuntMutation$data} from "../../services/mutations/characters/__generated__/HuntMutation.graphql";
import {useRelayEnvironment} from "react-relay";
import {characterIsVampire, tryCastToOneType} from "../../_base/utils";
import HelpTwoToneIcon from '@mui/icons-material/HelpTwoTone';
import {menuIconStyle} from "../_layout/menu/menu-base-utils";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import {useIsCharacterAwake} from "../../services/queries/character/IsCharacterAwakeQuery";
import {GuideRoutes} from "../guides/GuidesMain";
import type {Haven} from "../../services/queries/haven/GetHavensQuery";
import type {GenericReactComponent} from "../../_base/types";
import {useDialog} from "../../_base/providers/DialogProvider";
import {useCustomSnackbar} from "../../_base/notification-utils";
import {useCharacterRecoilState} from "../../session/hooks";
import type {QueryHaven} from "../_base/HavenMap";

const HuntInternal = ({characterId}: {characterId: string}) => {
    const environment = useRelayEnvironment();
    const {showDialog} = useDialog()
    const {enqueueSnackbar} = useCustomSnackbar();
    const [character,] = useCharacterRecoilState()

    const isCharacterVampire = characterIsVampire(character);
    const [awakeFetchKey, setAwakeFetchKey] = useState(1);
    // TODO see below
    // const [personalHavenId, setPersonalHavenId] = React.useState<?string>(null);

    const isCharacterAwake = useIsCharacterAwake(characterId, awakeFetchKey);

    const showHuntHelp = (_: any) => {
        const newTab = window.open(`#${GuideRoutes.hunt}`, "_blank");
        newTab.focus();
    }

    const onSectionSelected = (h: QueryHaven | string) => {
        const haven = tryCastToOneType<Haven, string>(h);
        
        if (haven?.id != null) {
            huntRequest(haven.id);
        }
    }

    // TODO - Hidden for now, because the personal Domain is already highlighted in the map locations. Check if it's ok with the feedbacks
    //
    // const selectPersonalHaven = () => {
    //     if (personalHavenId != null) {
    //         huntRequest(personalHavenId);
    //     }
    //     else {
    //         enqueueSnackbar({
    //             type: "warning",
    //             message: "Il tuo personaggio non ha attualmente un rifugio"
    //         });
    //     }
    // };
    //
    // const showPersonalHavenHuntButton = () => {
    //     if (personalHavenId != null) {
    //         return (
    //             <Box sx={{
    //                 width: "100%",
    //                 display: "flex",
    //                 justifyContent: "center",
    //                 padding: "1rem"
    //             }}>
    //                 <Button type="submit"
    //                         variant="outlined"
    //                         fullWidth
    //                         color="primary"
    //                         onClick={_ => selectPersonalHaven()}
    //                         sx={{
    //                             width: "80%"
    //                         }}>
    //                     Caccia nel Dominio personale
    //                 </Button>
    //             </Box>
    //         )
    //     }
    //
    //     return (<></>);
    // };

    const huntRequest = (havenId: ?string) => {
        if (character?.id != null) {
            showDialog(
                "Caccia",
                "Sei sicuro di voler mandare il tuo personaggio a caccia? Potrai giocare subito dopo, ma non potrai far cacciare di nuovo il personaggio per un altro giorno",
                () => {
                    if (character?.id != null && havenId != null) {
                        HuntMutation(environment, {
                            characterId: character.id,
                            havenId
                        })
                            .then((result: HuntMutation$data) => {
                                setAwakeFetchKey(p => p + 1);
                                if (result?.hunt?.result != null) {
                                    const huntResult = result.hunt.result;

                                    enqueueSnackbar({
                                        type: "info",
                                        duration: 7000,
                                        message: huntResult
                                    });
                                }
                                else {
                                    console.error("No back end message", result);
                                    enqueueSnackbar({
                                        type: "error",
                                        message: "Qualcosa non è andato come previsto, contatta un master per maggiori informazioni."
                                    });
                                }
                            })
                            .catch(e => {
                                setAwakeFetchKey(p => p + 1);
                                console.error("Error while hunting!", e);
                                enqueueSnackbar({
                                    type: "error",
                                    message: "Qualcosa non è andato come previsto, contatta un master per maggiori informazioni."
                                })
                            });
                    }
                    else {
                        enqueueSnackbar({
                            type: "error",
                            message: "Devi prima selezionare il personaggio."
                        });
                    }
                });
        }
        else {
            enqueueSnackbar({
                type: "warning",
                message: "Devi selezionare un personaggio prima di cacciare."
            });
        }
    };

    if (isCharacterVampire && isCharacterAwake) {
        return (
            <>
                <h1 >
                    <Stack direction="row" sx={{
                        alignItems: "middle"
                    }}>
                        <Box>
                            Caccia
                        </Box>
                        <IconButton onClick={showHuntHelp}>
                            <HelpTwoToneIcon sx={{menuIconStyle}}/>
                        </IconButton>
                    </Stack>
                </h1>

                {/*TODO - See above for the personal domain button*/}
                {/*{showPersonalHavenHuntButton()}*/}

                <HavenMap onSectionSelected={onSectionSelected} />
                          {/*TODO - See above for the personal domain button*/}
                          {/*setPersonalHaven={id => setPersonalHavenId(_ => id)} />*/}
            </>
        );
    }

    return (<></>);
};

const Hunt = (): GenericReactComponent => {
    const [character,] = useCharacterRecoilState()

    if (character?.id != null) {
        return (
            <HuntInternal characterId={character.id} />
        )
    }

    return (<></>);
}

export default Hunt;
