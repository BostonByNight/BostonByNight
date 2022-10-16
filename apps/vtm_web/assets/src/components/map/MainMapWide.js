// @flow

import React from 'react';
import areas from "./map-settings.json";
import type {Map} from "../../services/base-types";
import MainMapImageMapper from "./MainMapImageMapper";
import type {GenericReactComponent} from "../../_base/types";
import type {Haven} from "../../services/queries/haven/GetHavensQuery";

type Props = {
    maps: ?Array<Map>,
    onMapSelected: string => void;
}

const MainMapWide = ({maps, onMapSelected}: Props): GenericReactComponent => {
    const onMapSelectedInternal = (name: Haven | string) => {
        const [selectedMap,] = maps?.filter(m => m.name === name) ?? [];

        if (selectedMap?.id != null) {
            onMapSelected(selectedMap.id);
        }
    };

    return (
        <MainMapImageMapper areas={areas}
                            onAreaSelected={onMapSelectedInternal} />
    );
};

export default MainMapWide;
