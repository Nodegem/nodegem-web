import * as React from "react";
import { InputValuePort, OutputValuePort } from ".";
import { ValuePortIconView } from "../PortView";
import { InputBoxView } from "./Input/InputBoxView";

const InputValuePortView = ({ port } : { port: InputValuePort }) => {
    return (
        <>
            <ValuePortIconView port={port} />
            <span className={port.elementId}>{port.label}</span>
            <InputBoxView input={port.inputBox} />
        </>
    )
}

const OutputValuePortView = ({ port } : { port: OutputValuePort }) => {
    return (
        <>
            <span className={port.elementId}>{port.label}</span>
            <ValuePortIconView port={port} />
        </>
    )
}

export { InputValuePortView, OutputValuePortView };