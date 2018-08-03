import React, { PureComponent, CSSProperties } from "react";
import classNames from "classnames";

import "./Socket.scss";

export type SocketCSSProps = {
    socket: CSSProperties,
    selected: CSSProperties
}

export type SocketProps = {
    toggle: (toggleFunc: Function) => void;
    onHover?: () => void;
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

    private onMouseEnter = () => {
        this.setState({hovering: true});
    }

    private onMouseHover = () => {
        if(!this.state.hovering) return;
        this.props.onHover!();
    }

    private onMouseLeave = () => {
        this.setState({hovering: false});
    }

    private toggleSelected = () => {
        this.setState({selected: !this.state.selected});
    }

    public render() {

        const { selected, hovering } = this.state;
        const { className, style, toggle } = this.props;

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
            <a className={socketClass} style={combinedStyles} 
                onClick={() => toggle(this.toggleSelected)} onMouseEnter={this.onMouseEnter} 
                onMouseLeave={this.onMouseLeave} onMouseOver={this.onMouseHover} />
        );
    }

}