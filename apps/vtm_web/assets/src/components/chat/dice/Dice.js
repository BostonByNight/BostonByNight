// @flow

import React from 'react';
import type {GenericReactComponent} from "../../../_base/types";

type DiceProps = {
    src: string;
    alt: string;
}

const Dice = ({src, alt}: DiceProps): GenericReactComponent => {
    return (
        <img style={{height: "30px", margin: "0 5px"}} src={src} alt={alt}/>
    )
}

export default Dice;