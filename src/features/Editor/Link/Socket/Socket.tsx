import React, { PureComponent, CSSProperties } from "react";
import classNames from "classnames";
import { XYCoords } from "../../utils/types";
import IOBase from "../../Node/IO/IOBase";

import "./Socket.scss";
import Link from "../Link";

export type SocketCSSProps = {
    socket: CSSProperties,
    selected: CSSProperties
}

export type SocketProps = {
    io: IOBase;
    style?: SocketCSSProps;
    className?: string;
    onClick: (e: MouseEvent, socket: Socket) => void;
    onHover?: (socket: Socket) => void;
    onBlur?: (socket: Socket) => void;
};

export type SocketState = {
    selected: boolean;
    hovering: boolean;
}

export default class Socket extends PureComponent<SocketProps, SocketState> {

    static defaultProps : Partial<SocketProps> = {
        style: {
            socket: {},
            selected: {}
        },
        onHover: () => {}
    }

    state = {
        selected: false,
        hovering: false
    }

    get center() : XYCoords {
        const { x, y, width, height } = this._socket.getBoundingClientRect() as DOMRect;
        return [x + (width/2), y + (height / 2)];
    }

    private _socket : Element;
    private _link : Link | null;

    public get link() : Link | null {
        return this._link;
    }

    private onMouseEnter = () => {
        this.setState({hovering: true});
    }

    private onMouseHover = () => {
        if(!this.state.hovering) return;
        this.props.onHover!(this);
    }

    private onMouseLeave = () => {
        this.setState({hovering: false});
        this.props.onBlur!(this);
    }

    public toggle = () => {
        this.setState({selected: !this.state.selected});
    }

    private onClick = (e) => {
        const { onClick } = this.props;
        onClick(e, this);
    }

    public setLink = (link: Link | null) => {
        this._link = link;
        this.setState({selected: !!link});
    }

    public render() {

        const { selected, hovering } = this.state;
        const { className, style } = this.props;

        const socketClass = classNames({
            "socket": true,
            "selected": selected,
            "hovering": hovering,
            [className!]: !!className
        });

        let combinedStyles = {...style!.socket};
        if(selected) {
            combinedStyles = {...combinedStyles, ...style!.selected};
        }

        return (
            <a ref={(c) => this._socket = c!} className={socketClass} style={combinedStyles} 
                onClick={this.onClick} onMouseEnter={this.onMouseEnter} 
                onMouseLeave={this.onMouseLeave} onMouseOver={this.onMouseHover} />
        );
    }

}