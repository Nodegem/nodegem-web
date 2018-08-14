import React, { PureComponent } from "react";

import NodeCore, { NodeCoreProps } from "./NodeCore/NodeCore";
import { XYCoords } from "../utils/types";
import InputList from "./Lists/InputList";
import OutputList from './Lists/OutputList';

import "./Node.scss";

export type NodeProps = {
    title: string;
    size: [number, number];
    inputs: {name: string}[];
    outputs: {name: string}[];
    onStartConnector: (e: React.MouseEvent) => void;
    onCompleteConnector: (e: React.MouseEvent) => void;
    position?: XYCoords;
    handle?: string | null;
}

export type NodeState = {
}

export default class Node extends PureComponent<NodeProps & NodeCoreProps, NodeState> {

    static defaultProps : Partial<NodeProps> = {
        handle: ".header",
    }

    private handleStartConnector = (e: React.MouseEvent) => {
        this.props.onStartConnector(e);
    }

    private handleCompleteConnector = (e: React.MouseEvent) => {
        this.props.onCompleteConnector(e);
    }

    public render() {

        const { size, title, handle, position, onDrag, onDragStop, onDragStart, inputs, outputs } = this.props;
        let [width, height] = size;

        return (
            <NodeCore position={position} size={[width, height]} 
                        handle={handle} onDrag={onDrag} 
                        onDragStart={onDragStart} onDragStop={onDragStop}
            >
                <div className="header">
                    <span className="title">{title}</span>
                </div>
                <div className="content">
                    <InputList items={inputs} onCompleteConnector={this.handleCompleteConnector} />
                    <OutputList items={outputs} onStartConnector={this.handleStartConnector} />
                </div>
            </NodeCore>
        )
    }
}