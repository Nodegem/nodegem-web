import React, { PureComponent, CSSProperties } from "react";
import classNames from "classnames";

import "./Socket.scss";

export type SocketCSSProps = {
    socket: CSSProperties,
    selected: CSSProperties
}

export type SocketProps = {
    size: [number, number];
    style?: SocketCSSProps;
    className?: string;
};

export type SocketState = {
    selected: boolean;
}

export default class Socket extends PureComponent<SocketProps, SocketState> {

    static defaultProps : Partial<SocketProps> = {
        style: {
            socket: {},
            selected: {}
        }
    }

    state = {
        selected: true
    }

    public render() {

        const { selected } = this.state;
        const { className, size, style } = this.props;
        const [width, height] = size;

        const socketClass = classNames({
            "socket": true,
            "selected": selected,
            [className!]: !!className
        });

        return (
            <div />
        );
    }

}