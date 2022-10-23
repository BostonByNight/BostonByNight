// @flow

import {useRelayEnvironment} from "react-relay";
import {useRecoilState} from "recoil";
import type {SessionCharacter} from "../services/base-types";
import {sessionCharacterStateAtom} from "./atoms";
import {useEffect} from "react";
import {getSessionCharacter} from "../services/queries/accounts/SessionCharacterQuery";
import {updateSessionCharacter} from "../services/mutations/sessions/UpdateSessionCharacterMutation";

export const useCharacterRecoilState = (): [?SessionCharacter, ((?SessionCharacter) => void)] => {
    const environment = useRelayEnvironment()
    const [character, setCharacter] = useRecoilState<?SessionCharacter>(sessionCharacterStateAtom)

    useEffect(() => {
        if (character == null) {
            getSessionCharacter(environment)
                .then(response => {
                    const character = response?.getSessionCharacter

                    if (character != null) {
                        setCharacter(_ => ({
                            id: character?.id,
                            name: character?.name,
                            approved: character?.approved === true,
                            clan: {
                                ...character?.clan
                            }
                        }))
                    }
                })
                .catch(e => {
                    console.error("Error while trying to fetch the session character", e);
                });
        }
    }, [environment, character, setCharacter])

    const setCharacterRemote = (character: ?SessionCharacter) => {
        if (character?.id != null) {
            const characterId = character.id;

            updateSessionCharacter(environment, characterId)
                .then(_ => setCharacter(character))
                .catch(e => console.error("Error while saving session character", e));
        }
        else {
            setCharacter(character)
        }
    }

    return [character, setCharacterRemote]
}
