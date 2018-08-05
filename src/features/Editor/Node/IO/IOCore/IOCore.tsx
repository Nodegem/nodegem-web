import React, { PureComponent } from "react";
import classNames from "classnames";
import Output from "../Output/Output";
import Input from "../Input/Input";
import Socket from "../../../Link/Socket/Socket";
import IOBase from "../IOBase";

import './IOCore.scss';

export type IOOption = Input | Output | IOBase;

export type IOProps = {
    label: JSX.Element | string;
    onToggle?: (toggle: Function) => void;
    onClick?: (e: MouseEvent, io: IOBase) => void;
    onHover?: (io: IOBase, core: IOCore) => void;
    onBlur?: (io: IOBase, core: IOCore) => void;
    onSocketHover?: (socket: Socket, io: IOBase) => void;
    onSocketBlur?: (socket: Socket, io: IOBase) => void;
}

export type IOCoreProps = {
    className?: string;
}

export type IOCallbacks = {
    onHover?: (core: IOCore) => void;
    onBlur?: (core: IOCore) => void;
    onClick?: (e: MouseEvent, core: IOCore) => void;
}

export type IOCoreState = {
    hovering: boolean;
}

type IOType = "input" | "output";

export default class IOCore extends PureComponent<IOCoreProps & IOCallbacks & {type: IOType} , IOCoreState> {

    static defaultProps : Partial<IOCoreProps & IOCallbacks> = {
        onHover: () => {},
        onBlur: () => {},
        onClick: () => {}
    }

    state = {
        hovering: false
    }

    private onMouseEnter = () => {
        this.setState({hovering: true});
        this.props.onHover!(this);
    }

    private onMouseLeave = () => {
        this.setState({hovering: false});
        this.props.onBlur!(this);
    }

    private onMouseDown = (e: any) => {
        this.props.onClick!(e, this);
    }

    public render() {

        const { hovering } = this.state;
        const { type, className } = this.props;

        const ioClasses = classNames({
            "node-io": true,
            [type]: true,
            [className!]: !!className,
            "hovering": hovering
        });

        return (
            <div className={ioClasses} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onMouseDown={this.onMouseDown}>
                {this.props.children}
            </div>
        );
    }

}