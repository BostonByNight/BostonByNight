// @flow

import React from "react";
import {Link, useHistory} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import DisciplinesControl from "./controls/DisciplinesControl";
import PredatorTypeControl from "./controls/PredatorTypeControl";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {useFragment, useRelayEnvironment} from "react-relay";
import {characterConcealedInfoFragment} from "../../services/queries/character/CharacterFragments";
import CharacterFragmentProvider from "../_data/CharacterFragmentProvider";
import {object, string} from "yup";
import {useFormik} from "formik";
import useStyles from "../Main.Layout.Style";
import AddAdvantagesMutation from "../../services/mutations/characters/AddAdvantagesMutation";
import {characterHasDisciplines, characterIsVampire,} from "../../_base/utils";
import {MainRoutes} from "../MainRouter";
import {GuideRoutes} from "../guides/GuidesMain";
import type {
    CharacterFragments_characterConcealedInfo$data,
    CharacterFragments_characterConcealedInfo$key
} from "../../services/queries/character/__generated__/CharacterFragments_characterConcealedInfo.graphql";
import type {GenericReactComponent} from "../../_base/types";
import {useCustomSnackbar} from "../../_base/notification-utils";

type InternalElementProps = {
    character: CharacterFragments_characterConcealedInfo$key;
    children: GenericReactComponent => GenericReactComponent;
};

type SubmitProps = {
    disciplinePowers: string,
    discipline1: string,
    discipline2: string,
    predatorType: string,
    specialties: string,
    advantages: string,
    firstConviction: string,
    secondConviction: string,
    thirdConviction: string,
    notes: string
}

const InternalElement = ({character, children}: InternalElementProps): GenericReactComponent => {
    const infoFragment = useFragment(
        characterConcealedInfoFragment,
        character);

    return (
        <>
            {children(infoFragment)}
        </>
    );
};

const Creation4ValidationSchema = (isVampire: boolean, hasDisciplines: boolean) => {
    let shape = {
        specialties: string("Inserire le specialità").required("Devi aggiungere le specialità del personaggio"),
        advantages: string("Please, write your character advantages").required("Devi aggiungere almeno 5 punti di Vantaggi per il tuo personaggio"),
        notes: string("Add the notes you want to communicate to the masters").nullable().notRequired(),
        firstConviction: string("Add the first convictions").required("Devi aggiungere tutte e tre le Convinzioni del tuo personaggio"),
        secondConviction: string("Add the second convictions").required("Devi aggiungere tutte e tre le Convinzioni del tuo personaggio"),
        thirdConviction: string("Add the third convictions").required("Devi aggiungere tutte e tre le Convinzioni del tuo personaggio")
    };

    if (isVampire) {
        shape = {
            ...shape,
            predatorType: string("Please select your character predator type").required("Il tuo personaggio deve essere di un tipo di predatore particolare")
        };
    }

    if (hasDisciplines) {
        shape = {
            ...shape,
            disciplinePowers: string("Scrivi quali poteri di Disciplina vuoi acquisire").required("Devi specificare i poteri di Disciplina del tuo personaggio"),
            discipline1: string("Select your character first discipline").required("Devi specificare il primo potere di Disciplina del tuo personaggio"),
            discipline2: string("Select your character second discipline").required("Devi specificare il secondo potere di Disciplina del tuo personaggio")
        }
    }

    return object().shape(shape);
}

const Creation4EmptyObject = (isVampire: boolean, hasDisciplines: boolean) => {
    let initialValue = {
        specialties: "",
        advantages: "",
        notes: "",
        firstConviction: "",
        secondConviction: "",
        thirdConviction: ""
    };

    if (isVampire) {
        initialValue = {
            ...initialValue,
            predatorType: ""
        };
    }

    console.debug("hasDisciplines", hasDisciplines);

    if (hasDisciplines) {
        initialValue = {
            ...initialValue,
            disciplinePowers: "",
            discipline1: "",
            discipline2: ""
        }
    }

    return initialValue;
};

const capitalizeFirst = (s: string): string => `${s.charAt(0).toUpperCase()}${s.slice(1)}`;

const buildConvictions = (first: string, second: string, third: string): string => 
    `- ${capitalizeFirst(first)}\n- ${capitalizeFirst(second)}\n- ${capitalizeFirst(third)}`;

const Creation4 = (): GenericReactComponent => {
    const {enqueueSnackbar} = useCustomSnackbar()
    const classes = useStyles();
    const history = useHistory();
    const environment = useRelayEnvironment();

    const submit = (character: CharacterFragments_characterConcealedInfo$data) => ({
        disciplinePowers,
        discipline1,
        discipline2,
        predatorType,
        specialties,
        advantages,
        firstConviction,
        secondConviction,
        thirdConviction,
        notes
    }: SubmitProps) => {
        const disciplinesOk = !characterHasDisciplines(character) ||
            (discipline1 &&
            discipline2);

        const predatorTypeOk = !characterIsVampire(character) || predatorType;

        if (disciplinesOk &&
            predatorTypeOk &&
            specialties &&
            advantages &&
            firstConviction &&
            secondConviction &&
            thirdConviction) {

                let request = {
                    newStage: 4,
                    characterId: String(character?.id),
                    request: {
                        predatorTypeId: predatorType,
                        specialties: specialties,
                        advantages: advantages,
                        notes: notes,
                        convictions: buildConvictions(firstConviction, secondConviction, thirdConviction)
                    }
                };

                if (characterHasDisciplines(character)) {
                    request = {
                        ...request,
                        request: {
                            ...request.request,
                            disciplinePowers: disciplinePowers
                        },
                        attributes: [{
                            attributeId: discipline1,
                            characterId: String(character?.id),
                            value: 2
                        }, {
                            attributeId: discipline2,
                            characterId: String(character?.id),
                            value: 1
                        }]
                    };
                }

                if (characterIsVampire(character)) {
                    request = {
                        ...request,
                        request: {
                            ...request.request,
                            predatorTypeId: predatorType
                        }
                    };
                }

                AddAdvantagesMutation(environment, request)
                    .then(_ => history.push(MainRoutes.creation5))
                    .catch(e => {
                        console.error("error!", e);
                        enqueueSnackbar({
                            type: "error",
                            graphqlError: e,
                            message: "There was an error while saving the character"
                        })
                    });
        }
    }

    const InnerComponent = ({classes, characterInfo}: any) => {
        const [isVampire, hasDisciplines] = [characterIsVampire(characterInfo), characterHasDisciplines(characterInfo)];

        const formik = useFormik({
            initialValues: Creation4EmptyObject(
                isVampire,
                hasDisciplines
            ),
            validationSchema: Creation4ValidationSchema(
                isVampire,
                hasDisciplines),
            onSubmit: submit(characterInfo)
        });

        return (
            <form className={classes.centeredContainer} noValidate onSubmit={formik.handleSubmit}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography className={classes.defaultParagraph}>
                            In questa sezione puoi scegliere gli ultimi attributi della scheda del tuo personaggio, prima dei ritocchi finali.
                        </Typography>
                    </Grid>
                    <DisciplinesControl characterInfo={characterInfo}
                                        classes={classes}
                                        firstDiscipline={formik.values["discipline1"]}
                                        secondDiscipline={formik.values["discipline2"]}
                                        disciplinePowers={formik.values["disciplinePowers"]}
                                        firstError={formik.touched["discipline1"] && Boolean(formik.errors["discipline1"])}
                                        secondError={formik.touched["discipline2"] && Boolean(formik.errors["discipline2"])}
                                        disciplinePowersErrors={formik.touched["disciplinePowers"] && Boolean(formik.errors["disciplinePowers"])}
                                        onFirstDisciplineChange={formik.handleChange}
                                        onSecondDisciplineChange={formik.handleChange}
                                        onDisciplinePowersChange={formik.handleChange} />
                    <PredatorTypeControl characterInfo={characterInfo}
                                         classes={classes}
                                         formik={formik} />
                    <Grid item xs={12}>
                        <Typography className={classes.defaultParagraph}>
                            Di seguito, dovrai definire le specialit&agrave; del personaggio. Per maggior informazioni,
                            puoi consultare la <Link to={GuideRoutes.attributes}
                                                     target="_blank"
                                                     rel="noreferrer">guida</Link>. In breve, dovrai indicare:
                            <ul>
                                <li>Una specialit&agrave; relazionata al <b>Tipo di Predatore</b> selezionato.</li>
                                <li>Una specialit&agrave; per una Abilit&agrave; a piacere.</li>
                                <li>Una specialit&agrave; relazionata alle seguenti Abilit&agrave; se si ha
                                    almeno un pallino in esse:
                                    <ul>
                                        <li>Accademiche</li>
                                        <li>Espressivit&agrave;</li>
                                        <li>Manualit&agrave;</li>
                                        <li>Scienze</li>
                                    </ul>
                                </li>
                            </ul>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Specialità"
                            type="text"
                            id="specialties"
                            name="specialties"
                            multiline={true}
                            rows={5}
                            value={formik.values["specialties"]}
                            onChange={formik.handleChange}
                            error={formik.touched["specialties"] && Boolean(formik.errors["specialties"])}
                            helperText={formik.touched["specialties"] && formik.errors["specialties"]} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography className={classes.defaultParagraph}>
                            I vantaggi non possono essere selezionati automaticamente, poich&eacute; dovranno essere
                            vagliati dal master che controller&agrave; la tua scheda. I vantaggi sono la somma di
                            Background, Pregi e Difetti, di cui puoi trovare una lista completa
                            nella <Link to={GuideRoutes.attributes}
                                        target="_blank"
                                        rel="noreferrer">guida</Link>. Per la guida su come associare i Vantaggi
                            al tuo personaggio, consulta invece questa <Link to={GuideRoutes.creation}
                                                                             target="_blank"
                                                                             rel="noreferrer">sezione</Link>,
                            ricorda in breve che hai normalmente <b>cinque punti a disposizione</b> da assegnare.
                            Scrivi nel controllo di seguito tutti i vantaggi che vuoi assegnare al tuo personaggio, e
                            ricorda che se ti trovi in difficolt&agrave;, puoi sempre contattare un master via messaggio
                            o via Discord, tramite il link che puoi trovare nel menu a sinistra: la procedura di
                            iscrizione &egrave; comunque stata salvata fin qui!
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Vantaggi"
                            type="text"
                            id="advantages"
                            name="advantages"
                            multiline={true}
                            rows={5}
                            value={formik.values["advantages"]}
                            onChange={formik.handleChange}
                            error={formik.touched["advantages"] && Boolean(formik.errors["advantages"])}
                            helperText={formik.touched["advantages"] && formik.errors["advantages"]} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography className={classes.defaultParagraph}>
                            In questa sezione dovrai inserire le tre <b>Convinzioni</b> del tuo
                            personaggio. Puoi sceglierle tra quelle proposte nella&nbsp;
                            <Link to={GuideRoutes.creation} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  style={{color: "#C92929"}}>guida</Link>.
                            Se hai delle richieste particolari per il tuo personaggio, aggiungile alla definizione
                            delle Convinzioni, saranno vagliate dal master che controller&agrave; la tua scheda.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Prima Convinzione"
                            type="text"
                            id="firstConviction"
                            name="firstConviction"
                            value={formik.values["firstConviction"]}
                            onChange={formik.handleChange}
                            error={formik.touched["firstConviction"] && Boolean(formik.errors["firstConviction"])}
                            helperText={formik.touched["firstConviction"] && formik.errors["firstConviction"]} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Seconda Convinzione"
                            type="text"
                            id="secondConviction"
                            name="secondConviction"
                            value={formik.values["secondConviction"]}
                            onChange={formik.handleChange}
                            error={formik.touched["secondConviction"] && Boolean(formik.errors["secondConviction"])}
                            helperText={formik.touched["secondConviction"] && formik.errors["secondConviction"]} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Terza Convinzione"
                            type="text"
                            id="secondConviction"
                            name="thirdConviction"
                            value={formik.values["thirdConviction"]}
                            onChange={formik.handleChange}
                            error={formik.touched["thirdConviction"] && Boolean(formik.errors["thirdConviction"])}
                            helperText={formik.touched["thirdConviction"] && formik.errors["thirdConviction"]} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography className={classes.defaultParagraph}>
                            Infine, se hai delle richieste particolari per i master che dovranno visionare
                            la tua scheda, puoi inserirle in questa sezione.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Note"
                            type="text"
                            id="notes"
                            name="notes"
                            multiline={true}
                            rows={5}
                            value={formik.values["notes"]}
                            onChange={formik.handleChange}
                            error={formik.touched["notes"] && Boolean(formik.errors["notes"])}
                            helperText={formik.touched["notes"] && formik.errors["notes"]} />
                    </Grid>
                    <Grid item xs={12} sx={{margin: "1rem"}}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            color="primary"
                            className={classes.submit}
                            onClick={submit(characterInfo)}>
                            Conferma
                        </Button>
                    </Grid>
                </Grid>
            </form>
        );
    }

    return (
        <CharacterFragmentProvider showWarningWhenNoCharacterSelected={true}>
            {characterQuery =>
                <InternalElement character={characterQuery}>
                    { character =>
                        <InnerComponent characterInfo={character} classes={classes} />
                    }
                </InternalElement>
            }
        </CharacterFragmentProvider>
    );
}

export default Creation4;
