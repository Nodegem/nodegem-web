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
    socketSize?: number;
    onMouseDown?: (e: React.MouseEvent, output: Output) => void;
}

export type OutputState = {
    hover: boolean;
    connected: boolean;
}

export default class Output extends React.PureComponent<OutputProps, OutputState> {
    
    state = {
        hover: false,
        connected: false
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

    private handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        this.props.onMouseDown!(e, this);
    }

    public setConnected = (toggle: boolean) : void => {
        this.setState({connected: toggle});
    }

    public render() {

        const { label, socketSize } = this.props;
        const { hover, connected } = this.state;

        const outputClassName = classNames({
            "field": true,
            "output": true,
            "hover": hover,
            "connected": connected
        });

        return (
            <li className="node-output" onMouseDown={this.handleClick}>
               <a className={outputClassName} onClick={this.handleClick}>
                    <span className="label">{label}</span>
                    <span ref={(i) => this._icon = i!} style={{display: "flex"}} className="socket">
                        <Icon icon={connected || hover ? circle : circleO} size={socketSize} />
                    </span>
                </a>
            </li>
        )
    }

}