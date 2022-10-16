// @flow

import {uniques} from "../../../../_base/utils";
import {useCharactersChatAvatar} from "../../../../services/queries/character/GetCharactersChatAvatarQuery";

export type MenuCharacter = {
    +id: string;
    +chatAvatar: ?string;
}

export const useMenuCharactersAvatar = <T: MenuCharacter>(characters: Array<T>): Array<T> => {
    const characterIds = uniques(characters?.map(e => e?.id));
    const avatars = useCharactersChatAvatar(characterIds);

    return characters
        ?.map(c => {
            if (c != null) {
                return ({
                    ...c,
                    chatAvatar: avatars?.get(c?.id)
                });
            }

            return c;
        });
};
