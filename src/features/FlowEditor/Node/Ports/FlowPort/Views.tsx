import * as React from "react";
import { InputFlowPort, OutputFlowPort } from ".";

const InputFlowPortView = ({ port } : { port: InputFlowPort }) => {
    return (
        <div>
            Input Flow Port
        </div>
    )
}

const OutputFlowPortView = ({ port } : { port: OutputFlowPort }) => {
    return (
        <div>
            Output Flow Port
        </div>
    )
}

export { InputFlowPortView, OutputFlowPortView };