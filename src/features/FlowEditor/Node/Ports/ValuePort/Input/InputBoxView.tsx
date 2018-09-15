import * as React from "react";

import "./InputBoxView.scss";
import { observer } from "mobx-react";
import { InputValuePort } from "..";

const InputBoxView = observer(({ port } : {port: InputValuePort }) => {
    const input = port.inputBox;
    return (
        <span className="port-input" id={input.elementId}>
            <input type={port.inputBox.type} onChange={input.handleChange} value={input.value} placeholder={port.label} />
        </span>
    )
})

export { InputBoxView };