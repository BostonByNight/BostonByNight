// @flow

import React, {useState} from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import toggleSessionVisible from "../../services/mutations/admin/ToggleSessionVisibleMutation";
import {useRelayEnvironment} from "react-relay";
import type {GenericReactComponent} from "../../_base/types";
import {useCustomLazyLoadQuery} from "../../_base/relay-utils";
import {getUserVisibleQuery} from "../../services/queries/accounts/GetUserVisibleQuery";

const ToggleVisible = (): GenericReactComponent => {
    const environment = useRelayEnvironment()
    const {userOnlineVisible: visible} = useCustomLazyLoadQuery(getUserVisibleQuery)
    const [checked, setChecked] = useState(visible ?? false)

    const toggleSession = ({target: {checked}}: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(_ => checked)

        toggleSessionVisible(environment)
            .then(({toggleSessionVisible}) => {
                if (toggleSessionVisible !== checked) {
                    setChecked(_ => toggleSessionVisible)
                }
            })
            .catch(error => {
                console.error("There was an error while toggling master online visibility.", error)
                setChecked(_ => !checked)
            })
    }

    return (
        <div>
            <FormControlLabel control={
                <Switch checked={checked}
                        onChange={toggleSession} />
            } label="Label" />
        </div>
    );
}

export default ToggleVisible;
