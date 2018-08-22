import React, { Component } from "react";
import { CanvasContext } from "../../NodeCanvas/NodeCanvas";
import classNames from "classnames";

type FieldProps = {
    connected: boolean;
    type: "input" | "output";
    useDragHover?: boolean;
    children: React.ComponentType<{hover: boolean}>;
}

type FieldHandlers = {
    onClick?: (e: React.MouseEvent) => void;
    onMouseUp?: (e: React.MouseEvent) => void;
}

type FieldState = {
    hover: boolean;
}

export default class Field extends Component<FieldProps & FieldHandlers, FieldState> {

    static defaultProps : Partial<FieldProps & FieldHandlers> = {
        useDragHover: false,
        onMouseUp: () => {},
        onClick: () => {}
    }

    state = {
        hover: false
    }

    shouldComponentUpdate(nextProps : FieldProps, nextState : FieldState) : boolean {
        if(this.state.hover !== nextState.hover) {
            return true;
        }

        return false;
    }

    private handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        this.props.onClick!(e);
    }

    private handleMouseUp = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        this.props.onMouseUp!(e);
    }

    private handleMouseOver = (e: React.MouseEvent) => {
        this.setState({hover: true});
    }

    private handleMouseOut = (e: React.MouseEvent) => {
        this.setState({hover: false});
    }

    public render() {

        const { type, useDragHover, connected, children } = this.props;
        const { hover } = this.state;

        const fieldClassName = (isDragging: boolean) => classNames({
            "field": true,
            [type]: true,
            "hover": hover,
            "connected": connected,
            "drag-hover": useDragHover && hover && isDragging
        });

        return (
            <CanvasContext.Consumer>
                {
                    data => 
                        <li className={`node-${type}`}>
                            <a className={fieldClassName(data.dragging)} onMouseDown={this.handleClick} onMouseUp={this.handleMouseUp} 
                                onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
                                {React.createElement(children, { hover })}
                            </a>
                        </li>
                }
            </CanvasContext.Consumer>
        );
    }

}