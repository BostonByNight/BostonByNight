// @flow

import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import Grid from "@mui/material/Grid";
import AttributeSelectionField from "../controls/AttributeSelectionField";
import Button from "@mui/material/Button";
import appendAttributesMutation from "../../../services/mutations/characters/AppendAttributesMutation";
import type {AttributeTypeNames} from "../../../services/queries/info/AttributesQuery";
import useAttributesQuery from "../../../services/queries/info/AttributesQuery";
import type {
    CharacterAttributeRequest
} from "../../../services/mutations/characters/__generated__/AppendAttributesMutation.graphql";
import {getCharacterStageQuery} from "../../../services/queries/character/GetCharacterStageQuery";
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import {useRelayEnvironment} from "react-relay";
import {MainRoutes} from "../../MainRouter";
import {sortAttributes} from "../../../_base/info-helpers";
import {translateAttributeSection} from "../../../_base/dictionary-utils";
import type {GenericReactComponent} from "../../../_base/types";
import {useCustomSnackbar} from "../../../_base/notification-utils";
import type {SetControlError, SetControlValue} from "../controls/AttributeSelectionField";

export type RequestGenerator =
    (string, number) => CharacterAttributeRequest;

export type AttributeSelectorGetter =
    ((string, string) => any);

export type CreationBaseProps<TFormAttributes> = {|
    classes: any;
    characterId: string;
    currentStage: number;
    attributeTypeName: AttributeTypeNames;
    emptyAttributes: TFormAttributes;
    getAttributesToSave: (TFormAttributes, RequestGenerator) => Array<CharacterAttributeRequest>;
    children: AttributeSelectorGetter => any;
|}

const CreationBase = <TFormAttributes>(props: CreationBaseProps<TFormAttributes>): GenericReactComponent => {
    const history = useHistory()
    const environment = useRelayEnvironment()
    const {enqueueSnackbar} = useCustomSnackbar()

    const character = useCustomLazyLoadQuery(getCharacterStageQuery, {
        id: props.characterId
    }, {fetchPolicy: "network-only"})?.getCharacter;
    const data = useAttributesQuery();

    if (character?.stage != null) {
        if (character.stage > props.currentStage) {
            history.push(MainRoutes[`creation${props.currentStage + 1}`]);
        }
    }

    const [values, setValues] = useState<TFormAttributes>(props.emptyAttributes);
    const [errors, setErrors] = useState<any>({});

    const selectFields = () => {
        const attrs = data
            ?.filter(({ attributeType: { name } = {} }) => name === props.attributeTypeName)
            ?.sort((a, b) => sortAttributes(props.attributeTypeName)(a, b))
            ?.map(({ id, name, attributeType: { section: group } = {} }) => [translateAttributeSection(group ?? ""), String(id), name])
            ?? [];

        return [["", "", "None"]].concat(attrs);
    };

    const checkAttributes = (
        propertyName: string,
        propertyValue: string,
        setControlValue: SetControlValue,
        setControlError: SetControlError) => {

        if (Object.values(values).some(x => x === propertyValue)) {
            setControlValue("");
            setControlError("Attribute already taken");

            setErrors(e => {
                e[propertyName] = "Attribute already taken";
                return e;
            });

            setValues(vs => {
                (vs: any)[propertyName] = "";
                return vs;
            });
        }
        else {
            setControlError("");

            setErrors(e => {
                delete e[propertyName];
                return e;
            });

            setValues(vs => {
                (vs: any)[propertyName] = propertyValue;
                return vs;
            });
        }
    }

    const getAttributeSelector = (fieldName: string, label: string): any =>
        <AttributeSelectionField fieldName={fieldName}
                                 label={label}
                                 value={(values: any)[fieldName]}
                                 values={selectFields}
                                 onChange={checkAttributes} />;

    const onSubmit = (_: any) => {
        if (errors && Object.keys(errors).length > 0) {
            return;
        }

        if (Object.values(values).some(v => v === "")) {
            return;
        }

        const generateRequest = (attributeId: string, value: number): CharacterAttributeRequest => ({
            attributeId,
            characterId: String(props.characterId),
            value
        });

        const request: Array<CharacterAttributeRequest> = props.getAttributesToSave(values, generateRequest);

        appendAttributesMutation(environment, request, props.currentStage)
            .then(_ => history.push(`${MainRoutes.creationBase}${props.currentStage + 1}`))
            .catch(e => enqueueSnackbar({ type: 'error', graphqlError: e, message: "C'è stato un errore nell'aggiornamento del personaggio, per favore contattare un master." }));
    }

    return (
        <>
            <Grid container>
                {props.children(getAttributeSelector)}
            </Grid>
            <Button type="submit"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    className={props.classes.submit}
                    onClick={onSubmit}>
                Continua!
            </Button>
        </>
    )
}

export default CreationBase;
