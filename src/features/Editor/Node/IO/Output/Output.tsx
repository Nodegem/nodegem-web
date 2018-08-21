import React, {PureComponent} from "react";

import './Output.scss';
import classNames from "classnames";
import { Icon } from 'react-icons-kit';
import { circleO } from 'react-icons-kit/fa/circleO'
import { circle } from 'react-icons-kit/fa/circle'
import { XYCoords } from "../../../utils/types";

export type OutputProps = {
    label: string;
    id: string;
    connected: boolean;
    socketSize?: number;
    onMouseDown?: (e: React.MouseEvent, output: Output) => void;
}

export type OutputState = {
    hover: boolean;
}

export default class Output extends React.PureComponent<OutputProps, OutputState> {
    
    state = {
        hover: false
    }

    private _icon : Element;

    get anchorPoint() : XYCoords {
        const { x, y, width, height } = this._icon.getBoundingClientRect() as DOMRect;
        return [x + (width / 2), y + (height / 2)];
    }

    static defaultProps = {
        onMouseDown: () => {},
        socketSize: 15
    }

    private handleMouseOver = (e: React.MouseEvent) => {
        this.setState({hover: true});
    }

    private handleMouseOut = (e: React.MouseEvent) => {
        this.setState({hover: false});
    }

    private handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        this.props.onMouseDown!(e, this);
    }

    public render() {

        const { label, socketSize, connected } = this.props;
        const { hover } = this.state;

        const outputClassName = classNames({
            "field": true,
            "output": true,
            "hover": hover,
            "connected": connected
        });

        return (
            <li className="node-output">
               <a className={outputClassName} onMouseDown={this.handleClick} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                    <span className="label">{label}</span>
                    <span ref={(i) => this._icon = i!} style={{display: "flex"}} className="socket">
                        <Icon icon={connected || hover ? circle : circleO} size={socketSize} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} />
                    </span>
                </a>
            </li>
        )
    }

}