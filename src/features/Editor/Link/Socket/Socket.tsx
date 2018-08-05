import React, { PureComponent, CSSProperties } from "react";
import classNames from "classnames";

import "./Socket.scss";
import { XYCoords } from "../../utils/types";

export type SocketCSSProps = {
    socket: CSSProperties,
    selected: CSSProperties
}

export type SocketProps = {
    onToggle: (toggleFunc: Function) => void;
    onHover?: (socket: Socket) => void;
    onBlur?: (socket: Socket) => void;
    style?: SocketCSSProps;
    className?: string;
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

    private toggleSelected = () => {
        this.setState({selected: !this.state.selected});
    }

    public render() {

        const { selected, hovering } = this.state;
        const { className, style, onToggle } = this.props;

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
                onClick={() => onToggle(this.toggleSelected)} onMouseEnter={this.onMouseEnter} 
                onMouseLeave={this.onMouseLeave} onMouseOver={this.onMouseHover} />
        );
    }

}