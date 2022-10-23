// @flow

import React from "react";
import MainMapImageMapper from "../map/MainMapImageMapper";
import {drawLine, groupHavens} from "./haven-map-areas-helpers";
import {useCustomLazyLoadQuery} from "../../_base/relay-utils";
import {getHavensQuery} from "../../services/queries/haven/GetHavensQuery";
import {emptyExactObject, getMapKeys, toNotNullArray} from "../../_base/utils";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import HavenMapLegend from "./HavenMapLegend";
import {useCharacterRecoilState} from "../../session/hooks";
import type {SessionCharacter} from "../../services/base-types";
import type {GenericReactComponent} from "../../_base/types";
import type {Haven} from "../../services/queries/haven/GetHavensQuery";

export type QueryHaven = {|
    +id: string,
    +name: ?string,
    +x: ?number,
    +y: ?number,
    +resonance: ?string,
    +danger: ?number,
    +difficulty: ?number,
    +groundControl: ?number,
    +ownerDifficulty: ?number,
    +resourcesLevel: ?number,
    +character: ?{|
        +id: string,
        +name: ?string,
    |},
|}

type Props = {
    onSectionSelected: (QueryHaven | string) => void;
    fetchKey?: number;
    setPersonalHaven?: string => void;
};

type HavenInternalProps = {
    havens: QueryHaven[],
    showResonances: boolean,
    character: ?SessionCharacter,
    toggleResonanceView: (boolean => boolean) => void,
    onMapSelected: (QueryHaven | string) => void
}

const rowStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "1rem"
};

const HavenMapInternal = ({
                              havens,
                              showResonances,
                              character,
                              toggleResonanceView,
                              onMapSelected
}: HavenInternalProps) => {
    const radius = 20.8;

    const groupedHavens = groupHavens(havens)

    const areas = getMapKeys(groupedHavens)
        .map(x => Number(x))
        .sort((a, b) => a - b)
        .flatMap(key => {
            const values = groupedHavens
                .get(key)
                ?.sort((a, b) => (a?.x ?? 0) - (b?.x ?? 0));

            if (values != null) {
                return drawLine(showResonances, character?.id, key - 1, values, radius);
            }

            return [];
        });

    const memoLegend = React.useMemo(() => (
        <Box sx={rowStyle}>
            <HavenMapLegend />
        </Box>
    ), []);

    const legend = () => {
        if (showResonances) {
            return memoLegend;
        }

        return (<></>);}

    return (
        <>
            <Stack>
                <Box sx={rowStyle}>
                    <FormControlLabel control={
                        <Switch color="secondary"
                                checked={showResonances}
                                onChange={_ => toggleResonanceView(p => !p)} />
                    } label="Mostra Risonanze" componentsProps={{
                        typography: {
                            fontFamily: "ThroughTheNight"
                        }
                    }} />
                </Box>
                <MainMapImageMapper areas={areas}
                                    onAreaSelected={onMapSelected} />
                {legend()}
            </Stack>
        </>
    );
};

// The meaning of this class is to not have to cast the type
const HavenMapHavensNotNull = ({
                                   havens,
                                   showResonances,
                                   character,
                                   toggleResonanceView,
                                   onMapSelected
}: HavenInternalProps) =>
    React.useMemo(() => (
        <HavenMapInternal character={character}
                          havens={havens}
                          onMapSelected={onMapSelected}
                          showResonances={showResonances}
                          toggleResonanceView={toggleResonanceView} />
    ), [character, havens, onMapSelected, showResonances, toggleResonanceView]);

const sendPersonalHaven = (
    characterId: ?string,
    havens: QueryHaven[],
    setPersonalHaven: ?(string => void)
) => {
    if (setPersonalHaven != null) {
        const [personalHaven,] = havens?.filter(h => h?.character?.id === characterId) ?? [];

        if (personalHaven?.id != null) {
            setPersonalHaven(personalHaven.id);
        }
    }
};

const HavenMap = ({onSectionSelected, fetchKey, setPersonalHaven}: Props): GenericReactComponent => {
    const [character,] = useCharacterRecoilState()
    const havens = toNotNullArray(useCustomLazyLoadQuery(getHavensQuery, emptyExactObject(), {
        fetchPolicy: "network-only",
        fetchKey: fetchKey
    })?.getHavens?.result);

    const [showResonances, setShowResonances] = React.useState<boolean>(false);

    sendPersonalHaven(character?.id, havens, setPersonalHaven);

    const onMapSelectedInternal = (haven: Haven | string) =>
        onSectionSelected(haven);

    if (havens != null) {
        return (
            <HavenMapHavensNotNull character={character}
                                   havens={havens}
                                   onMapSelected={onMapSelectedInternal}
                                   showResonances={showResonances}
                                   toggleResonanceView={setShowResonances} />
        )
    }

    return (<></>);
}

export default HavenMap;
