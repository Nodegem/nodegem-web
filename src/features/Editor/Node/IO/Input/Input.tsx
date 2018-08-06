import React from "react";
import IOCore from "../IOCore/IOCore";
import Socket from "../../../Link/Socket/Socket";
import IOBase from "../IOBase";

import './Input.scss';

export default class Input extends IOBase {

    public render() {

        const { label, className, onToggle } = this.props;

        return (
            <IOCore type="input" className={className} onBlur={this.onBlur} onHover={this.onHover} onClick={this.onClick}>
                <Socket io={this} onHover={this.onSocketHover} onBlur={this.onSocketBlur} onToggle={(t) => onToggle!(t)}/>
                <span className="label">{label}</span>
            </IOCore>
        );

    }

}