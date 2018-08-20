import React, {PureComponent} from "react";

import './Input.scss';
import classNames from "classnames";
import { Icon } from 'react-icons-kit';
import { circleO } from 'react-icons-kit/fa/circleO';
import { circle } from 'react-icons-kit/fa/circle';
import { XYCoords } from "../../../utils/types";

export type InputProps = {
    label: string;
    id: string;
    socketSize?: number;
    onClick?: (e: React.MouseEvent, input: Input) => void;
    onMouseUp?: (e: React.MouseEvent, input: Input) => void;
}

export type InputState = {
    hover: boolean;
    connected: boolean;
}

export default class Input extends React.PureComponent<InputProps, InputState> {

    state = {
        hover: false,
        connected: false
    }

    static defaultProps = {
        onClick: () => {},
        onMouseUp: () => {},
        socketSize: 15
    }

    private _icon : Element;

    get anchorPoint() : XYCoords {
        const { x, y, width, height } = this._icon.getBoundingClientRect() as DOMRect;
        return [x + (width / 2), y + (height / 2)];
    }

    private handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        this.props.onClick!(e, this);
    }

    private handleMouseUp = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        this.props.onMouseUp!(e, this);
    }

    private handleMouseOver = (e: React.MouseEvent) => {
        this.setState({hover: true});
    }

    private handleMouseOut = (e: React.MouseEvent) => {
        this.setState({hover: false});
    }

    public setConnected = (toggle: boolean) : void => {
        this.setState({connected: toggle});
    }

    private noop = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }

    public render() {

        const { label, socketSize } = this.props;
        const { hover, connected } = this.state;

        const inputClassName = classNames({
            "field": true,
            "input": true,
            "hover": hover,
            "connected": connected
        });

        return (
            <li className="node-input">
                <a className={inputClassName} onClick={this.handleClick} onMouseDown={this.noop} onMouseUp={this.handleMouseUp}>
                    <span style={{display: "flex"}} className="socket" ref={(i) => this._icon = i!}>
                        <Icon size={socketSize} icon={hover || connected ? circle : circleO} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} />
                    </span>
                    <span className="label">{label}</span>
                </a>
            </li>
        );

    }

}