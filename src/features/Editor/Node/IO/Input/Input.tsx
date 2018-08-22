import React, { Component } from "react";

import './Input.scss';
import { Icon } from 'react-icons-kit';
import { circleO } from 'react-icons-kit/fa/circleO';
import { circle } from 'react-icons-kit/fa/circle';
import { XYCoords } from "../../../utils/types";
import Field from "../Field";

export type InputProps = {
    label: string;
    connected: boolean;
    id: string;
    socketSize?: number;
    onClick?: (e: React.MouseEvent, input: Input) => void;
    onMouseUp?: (e: React.MouseEvent, input: Input) => void;
}

export default class Input extends Component<InputProps> {

    static defaultProps = {
        onClick: () => { },
        onMouseUp: () => { },
        socketSize: 15
    }

    private _icon: Element;

    get anchorPoint(): XYCoords {
        const { x, y, width, height } = this._icon.getBoundingClientRect() as DOMRect;
        return [x + (width / 2), y + (height / 2)];
    }

    private handleClick = (e: React.MouseEvent) => {
        this.props.onClick!(e, this);
    }

    private handleMouseUp = (e: React.MouseEvent) => {
        this.props.onMouseUp!(e, this);
    }

    public render() {

        const { label, socketSize, connected } = this.props;

        return (
            <Field type="input" onClick={this.handleClick} onMouseUp={this.handleMouseUp} connected={connected} useDragHover>
                {
                    ({ hover }) =>
                        <>
                            <span style={{ display: "flex" }} className="socket" ref={(i) => this._icon = i!}>
                                <Icon size={socketSize} icon={hover || connected ? circle : circleO} />
                            </span>
                            <span className="label">{label}</span>
                        </>
                }
            </Field>
        );

    }

}