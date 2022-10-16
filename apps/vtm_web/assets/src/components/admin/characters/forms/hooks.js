// @flow

import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import useAttributesSlimQuery from "../../../../services/queries/info/AttributesSlimQuery";
import type {Attribute} from "../../../../services/queries/info/AttributesQuery";

export const UseAttributeSelectOptions = (addEmptyOption?: boolean): [?Array<Attribute>, () => ?Array<any>] => {
    const attributes = useAttributesSlimQuery() ?? [];

    const newAttributeSection = (sectionName: string) =>
        (<ListSubheader key={sectionName}>{sectionName}</ListSubheader>);

    const attributeSelector = (id: ?string, name: string) =>
        (<MenuItem key={id} value={id}>{name}</MenuItem>);

    const getAdminDashboardAttributesValues = () => attributes
        .reduce(([acc, previousTypeName], a) => {
            if (a?.id != null && a?.name != null && a?.attributeType?.name != null) {
                const {id, name, attributeType: {name: typeName}} = a;
                const newAcc =
                    typeName !== previousTypeName
                        ? [...acc, newAttributeSection(typeName)]
                        : acc;

                return [[...newAcc, attributeSelector(id, name)], typeName];
            }

            return [acc, previousTypeName];
        }, [[], ""]);

    if (addEmptyOption === true) {
        const emptyOption = attributeSelector(null, "None");
        return [attributes, () => [emptyOption].concat(getAdminDashboardAttributesValues())];
    }

    return [attributes, getAdminDashboardAttributesValues];
}
