import * as React from "react";
import { InputValuePort, OutputValuePort } from ".";
import { ValuePortIconView } from "../PortView";

const InputValuePortView = ({ port } : { port: InputValuePort }) => {
    return (
        <>
            <ValuePortIconView port={port} />
            <span className={port.elementId}>{port.label}</span>
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