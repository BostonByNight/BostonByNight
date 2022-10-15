// @flow

import React from "react";
import {useHistory} from "react-router-dom";
import {useRelayEnvironment} from "react-relay";
import CharacterInfoForm from "../../creation/controls/CharacterInfoForm";
import CreateNewNpcMutation from "../../../services/mutations/npcs/CreateNewNpcMutation";
import {MainRoutes} from "../../MainRouter";
import {Routes} from "../../../AppRouter";
import type {GenericReactComponent} from "../../../_base/types";
import {useCustomSnackbar} from "../../../_base/notification-utils";
import {useCharacterRecoilState} from "../../../session/hooks";

const CreateNewNpc = (): GenericReactComponent => {
    const history = useHistory()
    const environment = useRelayEnvironment()
    const {enqueueSnackbar} = useCustomSnackbar()
    const [,updateCurrentCharacter] = useCharacterRecoilState()

    const onSubmit = (values: any) => {
        CreateNewNpcMutation(environment, values)
            .then(response => {
                if (response?.createNpc?.character?.id != null) {
                    updateCurrentCharacter({
                        id: response.createNpc?.character?.id,
                        name: response?.createNpc?.character?.id ?? "No name available",
                        clan: {
                            ...response?.createNpc?.character?.clan
                        }
                    })

                    // Forcing the cast after having checked the id for nulls
                    const characterId: string = (response?.createNpc?.character?.id: any);
                    history.push(MainRoutes.defineNpc(characterId));
                }
                else {
                    history.push(Routes.map);
                }
            })
            .catch(e => enqueueSnackbar({ type: 'error', graphqlError: e, message: "An error happened while creating the user." }));
    }

    return (
        <CharacterInfoForm onSubmit={onSubmit} />
    );
}

export default CreateNewNpc;
