import * as React from "react";

import "./InputBoxView.scss";
import { observer } from "mobx-react";
import { InputValuePort } from "..";

const InputBoxView = observer(({ port } : {port: InputValuePort }) => {
    const input = port.inputBox;

    const additionalAttributes = {};
    if(port.inputBox.type === "number") {
        additionalAttributes["step"] = "any";
    }

    return (
        <span className="port-input" id={input.elementId}>
            <input {...additionalAttributes} type={port.inputBox.type} onChange={input.handleChange} value={input.value} placeholder={port.label} />
        </span>
    )
})

export { InputBoxView };