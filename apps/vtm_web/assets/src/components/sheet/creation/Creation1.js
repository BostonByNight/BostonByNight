// @flow

import React, {useContext} from "react";
import {useHistory} from "react-router-dom";
import createCharacter from "../../../services/mutations/characters/CreateCharacterMutation";
import {updateCurrentCharacter} from "../../../services/session-service";
import {Routes} from "../../../AppRouter";
import {UtilityContext} from "../../../contexts";
import {useRelayEnvironment} from "react-relay";
import MainLayout from "../../MainLayout";
import CharacterInfoForm from "../controls/CharacterInfoForm";
import type { CharacterCreationRequest } from "../../../services/mutations/npcs/__generated__/CreateNewNpcMutation.graphql";

const Creation1 = (): any => {
    const history = useHistory();
    const environment = useRelayEnvironment();
    const { showUserNotification } = useContext(UtilityContext);

    const onSubmit = (values: CharacterCreationRequest) => {
        createCharacter(environment, values)
            .then(response => {
                console.log("response", response);
                if (response?.createCharacter != null) {
                    updateCurrentCharacter({
                        id: response.createCharacter.id,
                        name: response.createCharacter.name ?? "No name available"
                    });

                    history.push(Routes.creation2);
                }
            })
            .catch(e => showUserNotification({ type: 'error', graphqlError: e, message: "An error happened while creating the user." }));
    }

    return (
        <MainLayout>
            <CharacterInfoForm onSubmit={onSubmit} />
        </MainLayout>
    );
}

export default Creation1;
