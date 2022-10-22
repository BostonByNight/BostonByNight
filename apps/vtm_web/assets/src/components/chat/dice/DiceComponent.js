// @flow

import React from 'react';
import ReactMarkdown from "react-markdown";
import Dice from './Dice.js';
import type {GenericReactComponent} from "../../../_base/types";

type DiceComponentProps = {
    result: string;
    components: any;
}

const DiceComponent = ({result, components}: DiceComponentProps): GenericReactComponent => {
    const difficulty = result.substring(result.indexOf('difficolt'), result.length - 1);
    const parsedResultText = result.substring(0, result.indexOf('(')) + ' - ' + difficulty;

    const getBeastDiceComponent = (diceResult: number) => {
        if (diceResult === 1) {
            return ["/dice/bestial-fail.webp", "fallimento bestiale"]
        } else if (diceResult < 6) {
            return ["/dice/red-fail.webp", "fallimento"]
        } else if (diceResult === 10) {
            return ["/dice/red-crit.webp", "critico bestiale"]
        } else {
            return ["/dice/red-success.webp", "successo"]
        }
    }

    const getNormalDiceComponent = (diceResult: number) => {
        if (diceResult < 6) {
            return ["/dice/normal-fail-white.webp", "fallimento"]
        } else if (diceResult === 10) {
            return ["/dice/normal-crit-white.webp", "successo critico"]
        } else {
            return ["/dice/normal-success-white.webp", "successo"]
        }
    }

    const getDiceComponent = (diceResult: string, index: number) => {
        const [first] = diceResult
        const rest = diceResult.slice(0)
        const isBeastDice = first === "*"

        const [src, alt] =
            isBeastDice
                ? getBeastDiceComponent(Number(rest.replaceAll("*", "")))
                : getNormalDiceComponent(Number(rest))

        return <Dice src ={src} alt={alt} key={index} />
    }

    const createDices= () => result
        .substring(result.indexOf('(') + 1, result.indexOf(', difficolt'))
        .split(', ')
        .filter(ex => ex != null)
        .map(getDiceComponent)

    return (
        <>

            <ReactMarkdown components={components} className="no-padding-paragraph">
                {parsedResultText}
            </ReactMarkdown>
            {createDices()}
        </>
    )
}

export default DiceComponent;