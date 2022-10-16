// @flow

import React from "react";
import Typography from "@mui/material/Typography";
import {guideStyle, titleStyle} from "../GuidesStyles";
import {useCustomLazyLoadQueryNoVar} from "../../../_base/relay-utils";
import {attributesCompleteQuery} from "../../../services/queries/info/AttributesCompleteQuery";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "../../../_base/components/TabPanel";
import GuidesAttributesAttributes from "./guide-attributes/GuidesAttributesAttributes";
import GuidesAttributesDisciplines from "./guide-attributes/GuidesAttributesDisciplines";
import GuidesAttributesAdvantages from "./guide-attributes/GuidesAttributesAdvantages";
import ParsedText from "../../../_base/components/ParsedText";
import type {GenericEvent, GenericReactComponent} from "../../../_base/types";

type AttributeFromQuery = {|
    +id: string,
    +name: ?string,
    +order: ?number,
    +description: ?string,
    +attributeType: ?{|
        +id: string,
        +name: ?string,
        +section: ?string,
    |},
|}

const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

const GuidesAttributes = (): GenericReactComponent => {
    const [value, setValue] = React.useState(0);

    const handleChange = (_event: GenericEvent, newValue: number) => {
        setValue(newValue);
    };

    const attributes = useCustomLazyLoadQueryNoVar(attributesCompleteQuery, {
        fetchPolicy: "store-or-network"
    })?.attributes ?? [];

    const sortAttributes = (name: string) =>
        (a: ?AttributeFromQuery, b: ?AttributeFromQuery) => {
            if (name !== "Attribute") {
                if (a?.name != null && b?.name != null) {
                    if (a.name > b.name) return 1;
                    else if (a.name === b.name) return 0;
                    else return -1;
                }

                return 0;
            }
            else {
                return Number(a?.id) - Number(b?.id);
            }
        };

    const ShowAttribute = ({name, description}: {
        name: ?string,
        description: ?string
    }) => (
        <>
            <h3 style={titleStyle}>{name}</h3>
            <ParsedText text={description} internalDivSx={{fontSize: "0.9rem"}} />
        </>
    );

    const showAttributes = (name: string, section?: string) =>
        attributes
            .filter(a => a?.attributeType?.name === name)
            .filter(a => section == null || a?.attributeType?.section === section)
            .sort((a, b) => sortAttributes(name)(a, b))
            .map(a => (<ShowAttribute key={a?.id} 
                                      name={a?.name} 
                                      description={a?.description} />));

    return (
        <Box sx={{ width: '100%' }}>
            <Typography paragraph>
                <h1 style={titleStyle}>
                    Abilit&agrave;, Attributi e altri valori della Scheda
                </h1>
            </Typography>

            <Typography paragraph sx={guideStyle}>
                Si propongono di seguito una lista di Attributi, Abilit&agrave;, Discipline e Vantaggi disponibili in fase di creazione,
                con relativa descrizione.
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Attributi e Abilità" {...a11yProps(0)} />
                    <Tab label="Discipline" {...a11yProps(1)} />
                    <Tab label="Vantaggi" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <GuidesAttributesAttributes showAttributes={showAttributes} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <GuidesAttributesDisciplines />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <GuidesAttributesAdvantages showAttributes={showAttributes} />
            </TabPanel>
        </Box>
    );
}

export default GuidesAttributes;
