// @flow

import React from "react";
import {useFragment} from "react-relay";
import {characterStateFragment} from "../../../../services/queries/character/CharacterFragments";
import Typography from "@mui/material/Typography";
import type {
    CharacterFragments_characterState$key,
    CharacterFragments_characterState$data
} from "../../../../services/queries/character/__generated__/CharacterFragments_characterState.graphql";
import ParsedText from "../../../../_base/components/ParsedText";
import {mainFontFamily} from "../../../Main.Layout.Style";
import type {GenericReactComponent} from "../../../../_base/types";
import {useCustomLazyLoadQuery} from "../../../../_base/relay-utils";
import {GetCharacterOccupationQuery} from "../../../../services/queries/occupations/GetCharacterOccupationQuery";
import {
    GetOccupationByIdQuery,
    isOccupationCorporation
} from "../../../../services/queries/occupations/GetOccupationByIdQuery";

type Props = {
    characterQuery: CharacterFragments_characterState$key
}

type SheetElementProps = {
    sheet: CharacterFragments_characterState$data;
}

const CharacterSheetOthersSection = ({characterQuery}: Props): GenericReactComponent => {
    const sheet = useFragment(
        characterStateFragment,
        characterQuery);

    return (
        <>
            <Clan sheet={sheet} />
            <Experience sheet={sheet} />
            <Money sheet={sheet} />
            <Occupation sheet={sheet} />
            <PredatorType sheet={sheet} />
            <Biography sheet={sheet} />
            <DisciplinePowers sheet={sheet} />
            <Specialties sheet={sheet} />
            <Advantages sheet={sheet} />
            <Convictions sheet={sheet} />
            <Objects sheet={sheet} />
            <Notes sheet={sheet} />
        </>
    );
}

const sectionTitleStyle = {
    fontFamily: 'DefaultTypewriter',
    color: "secondary.light",
    fontSize: "24px",
};

const PredatorType = ({sheet}: SheetElementProps) => (
    <>
        <Typography sx={sectionTitleStyle}>
            Tipo di Predatore
        </Typography>
        <Typography sx={{
            ...mainFontFamily,
            fontSize: "1.2rem",
            marginBottom: "10px"
        }}>
            {sheet?.predatorType?.name}
        </Typography>
        <Typography sx={{
            ...mainFontFamily,
            marginBottom: "10px"
        }}>
            Difficolt&agrave; della caccia: <b>{sheet?.huntDifficulty}</b>
        </Typography>
    </>
);

const Clan = ({sheet}: SheetElementProps) => (
    <>
        <Typography sx={sectionTitleStyle}>
            Clan
        </Typography>
        <Typography sx={{
            ...mainFontFamily,
            fontSize: "1.2rem",
            marginBottom: "10px"
        }}>
            {sheet?.clan?.name}
        </Typography>
    </>
);

const Experience = ({sheet}: SheetElementProps) => (
    <>
        <Typography sx={sectionTitleStyle}>
            Esperienza
        </Typography>
        <Typography sx={{
            ...mainFontFamily,
            marginBottom: "10px"
        }}>
            <b>{sheet?.experience}</b> punti esperienza disponibili su <b>{sheet?.totalExperience}</b>
        </Typography>
    </>
);

const Money = ({sheet}: SheetElementProps) => (
    <>
        <Typography sx={sectionTitleStyle}>
            Denaro
        </Typography>
        <Typography sx={{
            ...mainFontFamily,
            marginBottom: "10px"
        }}>
            <b>$ {sheet?.money}</b>
        </Typography>
    </>
)

const ShowOccupation = ({occupationId, level}: {occupationId: string, level: number}) => {
    const occupation = useCustomLazyLoadQuery(GetOccupationByIdQuery, {id: occupationId})
        ?.getOccupation

    if (isOccupationCorporation(occupation)) {
        const [levelName, levelSalary] =
            // TODO: find a cleverer way to get "numeric" properties
            // $FlowFixMe
            [occupation[`level${level}Name`], occupation[`level${level}Salary`]]

        return (
            <>
                <Typography sx={sectionTitleStyle}>
                    Corporazione
                </Typography>
                <Typography sx={{
                    ...mainFontFamily,
                    marginBottom: "10px"
                }}>
                    <b>{occupation?.name}</b>
                </Typography>
                <Typography sx={sectionTitleStyle}>
                    Livello
                </Typography>
                <Typography sx={{
                    ...mainFontFamily,
                    marginBottom: "10px"
                }}>
                    <b>{levelName} ($ {levelSalary} giornalieri)</b>
                </Typography>
            </>
        );
    }
    else {
        return (
            <>
                <Typography sx={sectionTitleStyle}>
                    Maschera
                </Typography>
                <Typography sx={{
                    ...mainFontFamily,
                    marginBottom: "10px"
                }}>
                    <b>{occupation?.name} ($ {occupation?.level1Salary ?? 0} giornalieri)</b>
                </Typography>
            </>
        );
    }
}

const Occupation = ({sheet}: SheetElementProps) => {
    const characterOccupation = useCustomLazyLoadQuery(GetCharacterOccupationQuery, {characterId: sheet?.id})
        ?.getCharacterOccupation

    if (characterOccupation?.occupation?.id != null) {
        return (<ShowOccupation occupationId={characterOccupation.occupation.id} level={characterOccupation.level ?? 1} />)
    }

    return (<></>)
}

type InfoElementProps = {
    title: string;
    text: ?string;
    titleSx?: any;
    textSx?: any;
}

const InfoElement = ({title, text, titleSx, textSx}: InfoElementProps) => (
    <>
        <Typography sx={{
            ...sectionTitleStyle,
            ...titleSx
        }}>
            {title}
        </Typography>
        <ParsedText text={text ?? ""} internalDivSx={{
            ...mainFontFamily,
            ...textSx
        }} />
    </>
);

const Biography = ({sheet}: SheetElementProps) => (
    <InfoElement title="Biografia" text={sheet?.biography} titleSx={{
        fontSize: "2rem",
        marginTop: "1rem"
    }} />
);

const DisciplinePowers = ({sheet}: SheetElementProps) => (
    <InfoElement title="Poteri" text={sheet?.disciplinePowers} textSx={{
        marginBottom: "10px"
    }} />
);

const Specialties = ({sheet}: SheetElementProps) => (
    <InfoElement title="Specialit??" text={sheet?.specialties} textSx={{
        marginBottom: "10px"
    }} />
);

const Advantages = ({sheet}: SheetElementProps) => (
    <InfoElement title="Vantaggi" text={sheet?.advantages} textSx={{
        marginBottom: "10px"
    }} />
);

const Convictions = ({sheet}: SheetElementProps) => (
    <InfoElement title="Convinzioni" text={sheet?.convictions} textSx={{
        marginBottom: "10px"
    }} />
);

const Objects = ({sheet}: SheetElementProps) => (
    <InfoElement title="Oggetti posseduti" text={sheet?.objects} textSx={{
        marginBottom: "10px"
    }} />
);

const Notes = ({sheet}: SheetElementProps) => (
    <InfoElement title="Note" text={sheet?.notes} textSx={{
        marginBottom: "10px"
    }} />
);

export default CharacterSheetOthersSection;
