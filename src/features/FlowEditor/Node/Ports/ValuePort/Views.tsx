import * as React from "react";
import { InputValuePort, OutputValuePort } from ".";

const InputValuePortView = ({ port } : { port: InputValuePort }) => {
    return (
        <div>
            Input Value Port
        </div>
    )
}

const OutputValuePortView = ({ port } : { port: OutputValuePort }) => {
    return (
        <div>
            Output Value Port
        </div>
    )
}

export { InputValuePortView, OutputValuePortView };