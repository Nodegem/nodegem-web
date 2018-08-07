import React from "react";
import IOCore from "../IOCore/IOCore";
import Socket from "../../../Link/Socket/Socket";
import IOBase from "../IOBase";

import './Input.scss';

export default class Input extends IOBase {

    public render() {

        const { label, className, onSocketClick } = this.props;

        return (
            <IOCore type="input" className={className} onBlur={this.onBlur} onHover={this.onHover} onClick={this.onClick}>
                <Socket ref={(s:Socket) => this.socket = s} io={this} onHover={this.onSocketHover} onBlur={this.onSocketBlur} onClick={this.onSocketClick}/>
                <span className="label">{label}</span>
            </IOCore>
        );

    }

}