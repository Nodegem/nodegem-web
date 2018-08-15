import React, {PureComponent} from "react";

import './Input.scss';
import classNames from "classnames";
import { Icon } from 'react-icons-kit';
import { circleO } from 'react-icons-kit/fa/circleO';
import { circle } from 'react-icons-kit/fa/circle';
import { XYCoords } from "../../../utils/types";

export type InputProps = {
    name: string;
    socketSize?: number;
    onClick?: (e: React.MouseEvent, input: Input) => void;
    onMouseUp?: (e: React.MouseEvent, input: Input) => void;
}

export type InputState = {
    hover: boolean;
}

export default class Input extends React.PureComponent<InputProps, InputState> {

    state = {
        hover: false
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

    public render() {

        const { name, socketSize } = this.props;
        const { hover } = this.state;

        const socketClassName = classNames({
            "socket": true,
            "hover": hover
        });

        const inputClassName = classNames({
            "input": true,
            "hover": hover
        });

        const labelClassName = classNames({
            "label": true,
            "hover": hover
        });

        return (
            <li className="node-input">
                <a className={inputClassName} onClick={this.handleClick} onMouseUp={this.handleMouseUp} href="#">
                    <span style={{display: "flex"}} className={socketClassName} ref={(i) => this._icon = i!}>
                        <Icon size={socketSize} icon={hover ? circle : circleO} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} />
                    </span>
                    <span className={labelClassName}>{name}</span>
                </a>
            </li>
        );

    }

}