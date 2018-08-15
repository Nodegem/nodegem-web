import React, { PureComponent } from "react";

import NodeCore, { NodeCoreProps, NodeCoreEventHandlers } from "./NodeCore/NodeCore";
import { XYCoords } from "../utils/types";
import InputList from "./Lists/InputList/InputList";
import OutputList from './Lists/OutputList/OutputList';
import Output from "./IO/Output/Output";
import Input from "./IO/Input/Input";
import { DragData } from "../Draggable/DraggableCore";

import "./Node.scss";


export type NodeProps = {
    title: string;
    id: string;
    size: [number, number];
    inputs: {name: string}[];
    outputs: {name: string}[];
    onStartConnector: (e: React.MouseEvent, output: Output, node: Node) => void;
    onCompleteConnector: (e: React.MouseEvent, input: Input, node: Node) => void;
    position?: XYCoords;
    handle?: string | null;
}

export type NodeHandlerProps = {
    onDragStart?: (e: React.MouseEvent, node: Node) => void;
    onDrag?: (e: React.MouseEvent, node: Node) => void;
    onDragStop?: (e: React.MouseEvent, node: Node) => void;
}

export type NodeState = {
}

type CombineProps = NodeProps & NodeHandlerProps;

export default class Node extends PureComponent<CombineProps, NodeState> {

    static defaultProps : Partial<CombineProps> = {
        handle: ".header",
        onStartConnector: () => {},
        onCompleteConnector: () => {},
        onDrag: () => {},
        onDragStart: () => {},
        onDragStop: () => {}
    }

    private handleStartConnector = (e: React.MouseEvent, output: Output) => {
        this.props.onStartConnector(e, output, this);
    }

    private handleCompleteConnector = (e: React.MouseEvent, input: Input) => {
        this.props.onCompleteConnector(e, input, this);
    }

    private handleNodeMove = (e: React.MouseEvent, data: DragData) => {
        this.props.onDrag!(e, this);
    }

    private handleNodeDragStart = (e: React.MouseEvent, data: DragData) => {
        this.props.onDragStart!(e, this);
    }

    private handleNodeDragStop = (e: React.MouseEvent, data: DragData) => {
        this.props.onDragStop!(e, this);
    }

    public render() {

        const { size, title, handle, position, inputs, outputs } = this.props;
        let [width, height] = size;

        return (
            <NodeCore position={position} size={[width, height]} 
                        handle={handle} onDrag={this.handleNodeMove} 
                        onDragStart={this.handleNodeDragStart} 
                        onDragStop={this.handleNodeDragStop}
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