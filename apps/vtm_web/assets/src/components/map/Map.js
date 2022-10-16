// @flow

import React from 'react';
import SubMap from "./SubMap";
import useSectionMaps from "../../services/queries/map/SectionMapsQuery";
import {useUpdateSessionMap} from "../_hooks/useUpdateSessionMap";
import useMap from "../../services/queries/map/MapQuery";
import {replaceAll, stripAccents} from "../../_base/utils";
import type {GenericReactComponent} from "../../_base/types";

type MapProps = {
    id: string;
}

const Map = ({ id }: MapProps): GenericReactComponent => {
    useUpdateSessionMap(id);

    const map = useMap(id);

    const maps = useSectionMaps(id);

    const getImageUrlName = (name: string) => {
        const fileName = stripAccents(replaceAll(name.toLowerCase(), " ", "-"));
        return `/${fileName}.webp`;
    };

    const imageUrlName = () =>
        map?.name != null
            ? getImageUrlName(map.name)
            : "";

    return (<SubMap maps={maps} imageUrl={imageUrlName()} />);
};

export default Map;
