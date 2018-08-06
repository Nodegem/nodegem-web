import React from "react";
import IOCore from "../IOCore/IOCore";
import Socket from "../../../Link/Socket/Socket";
import IOBase from "../IOBase";

import './Output.scss';

export default class Output extends IOBase {

    public render() {

        const { label, className, onToggle } = this.props

        return (
            <IOCore type="output" className={className} onBlur={this.onBlur} onHover={this.onHover} onClick={this.onClick}>
                <span className="label">{label}</span>
                <Socket io={this} onBlur={this.onSocketBlur} onHover={this.onSocketHover} onToggle={(t) => onToggle!(t)} />
            </IOCore>
        )
    }

}