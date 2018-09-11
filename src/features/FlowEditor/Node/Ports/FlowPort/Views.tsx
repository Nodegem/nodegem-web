import * as React from "react";
import { InputFlowPort, OutputFlowPort } from ".";
import { FlowPortIconView } from "../PortView";

const InputFlowPortView = ({ port } : { port: InputFlowPort }) => {
    return (
        <>
            <FlowPortIconView port={port} />
            <span className={port.elementId}>{port.label}</span>
        </>
    )
}

const OutputFlowPortView = ({ port } : { port: OutputFlowPort }) => {
    return (
        <>
            <span className={port.elementId}>{port.label}</span>
            <FlowPortIconView port={port} />
        </>
    )
}

export { InputFlowPortView, OutputFlowPortView };