import React, {Component} from "react";

import './Output.scss';
import { Icon } from 'react-icons-kit';
import { circleO } from 'react-icons-kit/fa/circleO'
import { circle } from 'react-icons-kit/fa/circle'
import { XYCoords } from "../../../utils/types";
import Field from "../Field";

export type OutputProps = {
    label: string;
    id: string;
    connected: boolean;
    socketSize?: number;
    onMouseDown?: (e: React.MouseEvent, output: Output) => void;
}

export default class Output extends Component<OutputProps> {

    private _icon : Element;

    get anchorPoint() : XYCoords {
        const { x, y, width, height } = this._icon.getBoundingClientRect() as DOMRect;
        return [x + (width / 2), y + (height / 2)];
    }

    static defaultProps = {
        onMouseDown: () => {},
        socketSize: 15
    }

    shouldComponentUpdate(nextProps, nextState) : boolean {
        return false;
    }

    private handleClick = (e: React.MouseEvent) => {
        this.props.onMouseDown!(e, this);
    }

    public render() {

        const { label, socketSize, connected } = this.props;

        return (
            <Field type="output" onClick={this.handleClick} connected={connected}>
                { 
                    ({ hover }) => 
                    <>
                        <span className="label">{label}</span>
                        <span ref={(i) => this._icon = i!} style={{display: "flex"}} className="socket">
                            <Icon icon={connected || hover ? circle : circleO} size={socketSize} />
                        </span>
                    </>
                }
            </Field>
        )
    }

}