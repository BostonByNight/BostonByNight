// @flow

import React, {useContext, useState} from "react";

import {useHistory} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import AttributeSelectionField from "../AttributeSelectionField";
import Button from "@material-ui/core/Button";
import appendAttributesMutation from "../../../services/mutations/characters/AppendAttributesMutation";
import {Routes} from "../../../AppRouter";
import type { AttributeTypeNames } from "../../../services/queries/info/AttributesQuery";
import {UtilityContext} from "../../../App";
import type {CharacterAttributeRequest} from "../../../services/mutations/characters/__generated__/AppendAttributesMutation.graphql";
import {getCharacterStageQuery} from "../../../services/queries/character/GetCharacterStageQuery";
import useAttributesQuery from "../../../services/queries/info/AttributesQuery";
import type {GetCharacterStageQuery} from "../../../services/queries/character/__generated__/GetCharacterStageQuery.graphql";
import type {SessionCharacter as Character} from "../../../services/session-service";
import {useCustomLazyLoadQuery} from "../../../_base/relay-utils";
import {useRelayEnvironment} from "react-relay";

export type CreationBaseProps<TFormAttributes> = {|
    classes: any;
    character: Character;
    currentStage: number;
    attributeTypeName: AttributeTypeNames;
    emptyAttributes: TFormAttributes;
    getAttributesToSave: (TFormAttributes, (string, number) => CharacterAttributeRequest) => Array<CharacterAttributeRequest>;
    children: ((string, string) => any) => any;
|}

const CreationBase = <TFormAttributes>(props: CreationBaseProps<TFormAttributes>): any => {
    const history = useHistory();
    const environment = useRelayEnvironment();
    const { setError } = useContext(UtilityContext);

    const character = useCustomLazyLoadQuery<GetCharacterStageQuery>(getCharacterStageQuery, {
        id: props.character.id
    })?.getCharacter;
    const data = useAttributesQuery();

    if (character?.stage != null) {
        if (character.stage > props.currentStage) {
            history.push(Routes[`creation${props.currentStage + 1}`]);
        }
    }

    const [values, setValues] = useState<TFormAttributes>(props.emptyAttributes);
    const [errors, setErrors] = useState<any>({});

    const selectFields = () => {
        const attrs = data
            ?.filter(({ attributeType: { name } }) => name === props.attributeTypeName)
            ?.map(({ id, name, attributeType: { section: group } }) => [group, String(id), name])
            ?? [];

        return [["", "", "None"]].concat(attrs);
    };

    const checkAttributes = (propertyName, propertyValue, setControlValue, setControlError) => {
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

    const onSubmit = _ => {
        if (errors && Object.keys(errors).length > 0) {
            return;
        }

        if (Object.values(values).some(v => v === "")) {
            return;
        }

        const generateRequest = (attributeId: string, value: number): CharacterAttributeRequest => ({
            attributeId,
            characterId: String(props.character.id),
            value
        });

        const request: Array<CharacterAttributeRequest> = props.getAttributesToSave(values, generateRequest);

        appendAttributesMutation(environment, request, props.currentStage)
            .then(_ => history.push(`${Routes.creationBase}${props.currentStage + 1}`))
            .catch(e => setError({ type: 'error', graphqlError: e, message: "There was an error while updating the character." }));
    }

    return (
        <>
            <Typography>
                Now you will have to select the attributes and abilities of your character.
            </Typography>
            <Grid container>
                {props.children(getAttributeSelector)}
            </Grid>
            <Button type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={props.classes.submit}
                    onClick={onSubmit}>
                Continue!
            </Button>
        </>
    )
}

export default CreationBase;
