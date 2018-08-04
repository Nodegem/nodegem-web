import React, { PureComponent } from "react";
import IOCore, { IOCoreProps, IOProps } from "../IOCore/IOCore";
import Socket from "../../../Link/Socket/Socket";

import './Input.scss';

export default class Input extends PureComponent<IOProps & IOCoreProps> {

    static defaultProps : Partial<IOProps & IOCoreProps> = {
        onHover: () => {},
        onBlur: () => {},
        onToggle: (t) => t(),
        onSocketHover: () => {},
        onSocketBlur: () => {},
        onClick: () => {}
    }

    private onBlur = (core: IOCore) : void => {
        this.props.onBlur!(this, core);
    }

    private onHover = (core: IOCore) : void => {
        this.props.onHover!(this, core);
    }

    private onSocketHover = (socket: Socket) : void => {
        this.props.onSocketHover!(socket, this);
    }

    private onSocketBlur = (socket: Socket) : void => {
        this.props.onSocketHover!(socket, this);
    }

    private onClick = (e: MouseEvent, io: IOCore) : void => {
        this.props.onClick!(e, this);
    }

    public render() {

        const { label, className, onToggle } = this.props;

        return (
            <IOCore type="input" className={className} onBlur={this.onBlur} onHover={this.onHover} onClick={this.onClick}>
                <Socket onHover={this.onSocketHover} onBlur={this.onSocketBlur} onToggle={(t) => onToggle!(t)}/>
                <span className="label">{label}</span>
            </IOCore>
        );

    }

}