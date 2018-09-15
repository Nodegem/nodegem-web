import * as React from "react";
import { InputValuePort, OutputValuePort } from ".";
import { ValuePortIconView } from "../PortView";
import { InputBoxView } from "./Input/InputBoxView";
import { observer } from "mobx-react";

const InputValuePortView = observer(({ port } : { port: InputValuePort }) => {
    return (
        <>
            { port.shouldShowInput 
                ? <InputBoxView port={port} />
                : (
                    <>
                        <ValuePortIconView port={port} />
                        <span className={port.elementId}>{port.label}</span> 
                    </>
                )
            }
        </>
    )
})

const OutputValuePortView = ({ port } : { port: OutputValuePort }) => {
    return (
        <>
            <span className={port.elementId}>{port.label}</span>
            <ValuePortIconView port={port} />
        </>
    )
}

export { InputValuePortView, OutputValuePortView };