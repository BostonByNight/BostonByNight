// @flow

import React from "react";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import type {FormSubmitProps} from "./AdminHavensForm";
import AdminHavensForm from "./AdminHavensForm";
import type {ResonancesFormSubmitProps} from "./AdminHavensResonanceForm";
import AdminHavensResonanceForm from "./AdminHavensResonanceForm";
import type {Haven} from "../../../../services/queries/haven/GetHavensQuery";
import {useResonanceTypes} from "../../../../services/queries/info/GetResonanceTypesQuery";
import type {GenericReactComponent} from "../../../../_base/types";
import type {DangerFormSubmitProps} from "./AdminHavensDangerForm";
import AdminHavensDangerForm from "./AdminHavensDangerForm";

type Props = {
    haven: Haven;
    havenCharacterId?: string;
    onSetHavenSubmitted: FormSubmitProps => void;
    onMarkResonanceSubmitted: ResonancesFormSubmitProps => void;
    onDangerUpdateSubmitted: DangerFormSubmitProps => void;
};

const AdminHavensFormSelector: GenericReactComponent =
    React.forwardRef(({haven, havenCharacterId, onSetHavenSubmitted, onMarkResonanceSubmitted, onDangerUpdateSubmitted}: Props, ref) => {
        const resonances = useResonanceTypes().map(x => [x, x]);

        const [value, setValue] = React.useState('1');

        const handleChange = (event: any, newValue: any) => {
            setValue(newValue);
        };

        return (
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Assegna Rifugio" value="1" />
                            <Tab label="Traccia Risonanza" value="2" />
                            <Tab label="Aggiungi pericolo" value="3" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <AdminHavensForm resonances={resonances}
                                         haven={haven}
                                         havenCharacterId={havenCharacterId}
                                         onSubmit={onSetHavenSubmitted}
                                         ref={ref} />
                    </TabPanel>
                    <TabPanel value="2">
                        <AdminHavensResonanceForm resonances={resonances}
                                                  haven={haven}
                                                  onSubmit={onMarkResonanceSubmitted}
                                                  ref={ref} />
                    </TabPanel>
                    <TabPanel value="3">
                        <AdminHavensDangerForm haven={haven}
                                               onSubmit={onDangerUpdateSubmitted}
                                               ref={ref} />
                    </TabPanel>
                </TabContext>
            </Box>
        );
    });

export default AdminHavensFormSelector;
