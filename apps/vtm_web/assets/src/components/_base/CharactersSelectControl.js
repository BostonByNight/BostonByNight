// @flow

import React, {useMemo} from "react";
import FormSelectField from "../../_base/components/FormSelectField";
import {emptyExactObject, orderAlphabetically} from "../../_base/utils";
import {useCustomLazyLoadQuery} from "../../_base/relay-utils";
import {allCharactersQuery} from "../../services/queries/character/AllCharactersQuery";
import PlainSelectField from "../../_base/components/PlainSelectField";
import type {GenericReactComponent} from "../../_base/types";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

type Props = {
    label: string;
    fieldName?: string;
    formik?: any;
    onChange?: string => void;
    value?: string;
    renderValue?: ?string[] => GenericReactComponent;
    sx?: any;
    containerSx?: any;
    multiple?: boolean;
}

type CharactersSelectControlInternalProps = {
    label: string,
    characterValues: [string, string][],
    onChange?: string => void;
    defaultValue?: string;
}

const CharactersSelectControl = (
    {label, fieldName, formik, onChange, value, sx, containerSx, multiple}: Props
): GenericReactComponent => {
    const allCharacters = useCustomLazyLoadQuery(allCharactersQuery, emptyExactObject())?.charactersList;

    const characterValues = useMemo((): Array<[string, string]> => {
        const values: Array<[string, string]> = allCharacters
            ?.map(v => [v?.id ?? "", v?.name ?? ""])
            ?.sort(([_aId, aName], [_bId, bName]) => orderAlphabetically(aName, bName)) ?? [];

        return [["", "None"]].concat(values);
    }, [allCharacters]);

    const getCharacterValue = (characterId: string) => {
        const [[,name],] = characterValues.filter(([id,]) => characterId === id);
        return name;
    };

    const renderValuesDelegate = (): ?(?string[] => GenericReactComponent) =>
        multiple
            ? (selected: ?string[]) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected?.map(value => (
                        <Chip key={value} label={getCharacterValue(value)} />
                    ))}
                </Box>
            )
            : undefined;

    if (formik != null) {
        return (
            <FormSelectField formik={formik}
                             fieldName={fieldName ?? "characterId"}
                             label={label}
                             values={characterValues}
                             renderValue={renderValuesDelegate()}
                             sx={sx}
                             containerSx={containerSx}
                             multiple={multiple} />
        );
    }

    return (
        <CharactersSelectControlInternal label={label}
                                         characterValues={characterValues}
                                         onChange={onChange}
                                         defaultValue={value} />
    );
};

const CharactersSelectControlInternal = (
    {label, characterValues, onChange, defaultValue}: CharactersSelectControlInternalProps
): GenericReactComponent => {
    const [value, setValue] = React.useState<string>(defaultValue ?? "");

    const onChangeInternal = (v: string) => {
        setValue(_ => v);

        if (onChange != null) {
            onChange(v);
        }
    };

    return (
        <PlainSelectField selectedValue={value}
                          onChange={onChangeInternal}
                          fieldName="characterId"
                          label={label}
                          values={characterValues}/>
    );
}

export default CharactersSelectControl;
