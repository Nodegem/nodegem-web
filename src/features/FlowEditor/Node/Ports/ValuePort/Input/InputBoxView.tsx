import * as React from "react";
import { InputBox } from "./InputBox";

import "./InputBoxView.scss";

const boxWidth = 70;
const inputWidth = .8 * boxWidth;

const InputBoxView = ({ input } : {input: InputBox }) => {
    return (
        <span className="port-input" id={input.elementId} style={{position: "absolute", left: -boxWidth, minWidth: boxWidth}}>
            <input type="text" onChange={input.handleChange} style={{ maxWidth: inputWidth }} />
        </span>
    )
}

export { InputBoxView };