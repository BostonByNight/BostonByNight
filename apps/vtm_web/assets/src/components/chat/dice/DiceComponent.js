// @flow
import React from 'react';
import ReactMarkdown from "react-markdown";
import Dice from './Dice.js'

const DiceComponent = ({result, components}) => {
    let parsedResultText = result.substring(0, result.indexOf('('));

    const createDices= () => {
        let results = result.substring(result.indexOf('(') + 1, result.indexOf(', difficolt')).split(', ');
        return results.map((el, index) => {
            if(el) {
                let src, alt;
                if (el.charAt(0) === '*') {
                    let parsedEl = parseInt(el.replace('*', ''));
                    if (parsedEl === 1) {
                        src="/dice/bestial-fail.webp";
                        alt="fallimento bestiale";
                    } else if (parsedEl < 6) {
                        src="/dice/red-fail.webp";
                        alt="fallimento";
                    } else if (parsedEl === 10) {
                        src="/dice/red-crit.webp";
                        alt="critico bestiale";
                    } else {
                        src="/dice/red-success.webp";
                        alt="successo";
                    }
                } else {
                    el = parseInt(el);
                    if (el < 6) {
                        src="/dice/normal-fail.webp";
                        alt="fallimento";
                    } else if (el === 10) {
                        src="/dice/normal-crit.webp";
                        alt="successo critico";
                    } else {
                        src="/dice/normal-success.webp";
                        alt="successo";
                    }
                }
                return <Dice src ={src} alt={alt} key={index} />
            }
        })
    }

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