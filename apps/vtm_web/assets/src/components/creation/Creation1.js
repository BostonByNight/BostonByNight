// @flow

import React from "react";
import {useHistory} from "react-router-dom";
import createCharacter from "../../services/mutations/characters/CreateCharacterMutation";
import {useRelayEnvironment} from "react-relay";
import CharacterInfoForm from "./controls/CharacterInfoForm";
import type {CharacterCreationRequest} from "../../services/mutations/npcs/__generated__/CreateNewNpcMutation.graphql";
import {MainRoutes} from "../MainRouter";
import type {GenericReactComponent} from "../../_base/types";
import {useCustomSnackbar} from "../../_base/notification-utils";
import {useCharacterRecoilState} from "../../session/hooks";

const Creation1 = (): GenericReactComponent => {
    const history = useHistory()
    const environment = useRelayEnvironment()
    const {enqueueSnackbar} = useCustomSnackbar()
    const [,updateCurrentCharacter] = useCharacterRecoilState()

    const onSubmit = (values: CharacterCreationRequest) => {
        createCharacter(environment, values)
            .then(response => {
                if (response?.createCharacter != null) {
                    updateCurrentCharacter({
                        id: response.createCharacter?.id,
                        name: response.createCharacter?.name ?? "No name available",
                        clan: {
                            // $FlowFixMe
                            ...response.createCharacter?.clan?.name
                        } 
                    })

                    history.push(MainRoutes.creation2);

                    // Refreshing the page in order to update the left menu
                    document.location.reload(false);
                }
            })
            .catch(e => {
                enqueueSnackbar({
                    type: 'error',
                    graphqlError: e,
                    message: "An error happened while creating the user."
                })
            });
    }

    return (
        <CharacterInfoForm onSubmit={onSubmit} />
    );
}

export default Creation1;
