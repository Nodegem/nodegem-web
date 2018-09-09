import * as React from "react";
import { InputFlowPort, OutputFlowPort } from ".";
import classNames from "classnames";
import { Icon } from "antd";
import { PortIOType } from "../types";

const PortIcon = ({ connected, type } : { connected: boolean, type: PortIOType }) => {

    const portClass = classNames({
        "connection": true,
        "connected": connected
    });

    const direction = type === "input" ? "caret-left" : "caret-right";
    return (
        <span className={portClass}><Icon type={direction} theme="outlined" /></span>
    )
}

const InputFlowPortView = ({ port } : { port: InputFlowPort }) => {
    return (
        <>
            <PortIcon connected={port.connected} type={port.ioType} />
            <span>{port.label}</span>
        </>
    )
}

const OutputFlowPortView = ({ port } : { port: OutputFlowPort }) => {
    return (
        <>
            <span>{port.label}</span>
            <PortIcon connected={port.connected} type={port.ioType} />
        </>
    )
}

export { InputFlowPortView, OutputFlowPortView };