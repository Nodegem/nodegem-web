import React, { PureComponent } from "react";
import IOCore, { IOCoreProps, IOCoreState, IOProps } from "../IOCore/IOCore";
import Socket from "../../../Link/Socket/Socket";

import './Output.scss';

export default class Output extends PureComponent<IOProps & IOCoreProps, IOCoreState> {

    static defaultProps : Partial<IOProps & IOCoreProps> = {
        onBlur: () => {},
        onHover: () => {},
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

        const { label, className, onToggle } = this.props

        return (
            <IOCore type="output" className={className} onBlur={this.onBlur} onHover={this.onHover} onClick={this.onClick}>
                <span className="label">{label}</span>
                <Socket onBlur={this.onSocketBlur} onHover={this.onSocketHover} onToggle={(t) => onToggle!(t)} />
            </IOCore>
        )
    }

}