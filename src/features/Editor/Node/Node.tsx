import React, { PureComponent } from "react";

import NodeCore from "./NodeCore/NodeCore";
import { XYCoords } from "../utils/types";
import Output from "./IO/Output/Output";
import Input from "./IO/Input/Input";
import { DragData } from "../Draggable/DraggableCore";
import { InputList, OutputList } from "./Lists";
import { IOData } from "../NodeCanvas/types";

import "./Node.scss";

export type NodeProps = {
    title: string;
    id: string;
    inputs: IOData[];
    outputs: IOData[];
    position?: XYCoords;
    handle?: string | null;
}

export type NodeMetaData = {
    id: string;
    position: XYCoords;
}

export type NodeHandlerProps = {
    onDragStart?: (e: React.MouseEvent, node: Node, data: NodeMetaData) => void;
    onDrag?: (e: React.MouseEvent, node: Node, data: NodeMetaData) => void;
    onDragStop?: (e: React.MouseEvent, node: Node, data: NodeMetaData) => void;
    onBlur?: (e: React.MouseEvent, node: Node) => void;
    onStartConnector: (e: React.MouseEvent, output: Output, node: Node) => void;
    onCompleteConnector: (e: React.MouseEvent, input: Input, node: Node) => void;
    onDoubleClick?: (e: React.MouseEvent, node: Node) => void;
}

type CombineProps = NodeProps & NodeHandlerProps;

const titleHeight = 40;
const fieldHeight = 30;

export default class Node extends PureComponent<CombineProps> {

    static defaultProps : Partial<CombineProps> = {
        handle: ".header",
        onStartConnector: () => {},
        onCompleteConnector: () => {},
        onDrag: () => {},
        onDragStart: () => {},
        onDragStop: () => {},
        onDoubleClick: () => {},
        onBlur: () => {}
    }

    private _inputList: InputList;
    private _outputList: OutputList;

    public getFieldById = <T extends (Input | Output)>(fieldId: string) : T | null => {
        const combinedList = [...this._inputList.inputs, ...this._outputList.outputs];
        for (let field of combinedList) {
            if(field.props.id === fieldId) {
                return field as T;
            }
        }
        return null;
    }

    private handleStartConnector = (e: React.MouseEvent, output: Output) => {
        this.props.onStartConnector(e, output, this);
    }

    private handleCompleteConnector = (e: React.MouseEvent, input: Input) => {
        this.props.onCompleteConnector(e, input, this);
    }

    private handleNodeMove = (e: React.MouseEvent, data: DragData) => {
        const {x, y} = data.position;
        this.props.onDrag!(e, this, {id: this.props.id, position: [x, y]});
    }

    private handleNodeDragStart = (e: React.MouseEvent, data: DragData) => {
        const {x, y} = data.position;
        this.props.onDragStart!(e, this, {id: this.props.id, position: [x, y]});
    }

    private handleNodeDragStop = (e: React.MouseEvent, data: DragData) => {
        const {x, y} = data.position;
        this.props.onDragStop!(e, this, {id: this.props.id, position: [x, y]});
    }

    private handleBlur = (e: React.MouseEvent) => {
        this.props.onBlur!(e, this);
    }

    private handleDoubleClick = (e: React.MouseEvent) => {
        this.props.onDoubleClick!(e, this);
    }

    public render() {

        const { title, handle, position, inputs, outputs } = this.props;

        const width = 200;
        const height = titleHeight + (fieldHeight * Math.max(inputs.length, outputs.length));

        return (
            <NodeCore position={position} size={[width, height]} 
                        handle={handle} onDrag={this.handleNodeMove} 
                        onDragStart={this.handleNodeDragStart} 
                        onDragStop={this.handleNodeDragStop}
                        onBlur={this.handleBlur} onDoubleClick={this.handleDoubleClick}
            >
                <div className="header">
                    <span className="title">{title}</span>
                </div>
                <div className="content">
                    <InputList ref={(il) => this._inputList = il!} items={inputs} onCompleteConnector={this.handleCompleteConnector} />
                    <OutputList ref={(ol) => this._outputList = ol!} items={outputs} onStartConnector={this.handleStartConnector} />
                </div>
            </NodeCore>
        )
    }
}