import React, { PureComponent } from "react";
import NodeSkeleton, { NodeContentStyles } from "./NodeSkeleton/NodeSkeleton";
import Input from "./IO/Input/Input";
import Output from "./IO/Output/Output";

import "./Node.scss";
import NodeCanvas from "../NodeCanvas/NodeCanvas";
import Socket from "../Link/Socket/Socket";
import NodeCore, { NodeCoreProps } from "./NodeCore/NodeCore";
import { DragData } from "../Draggable/DraggableCore";
import { XYCoords } from "../utils/types";

export type NodeProps = {
    canvas: NodeCanvas;
    inputs: {}[];
    outputs: {}[];
}

export type NodeState = {
}

const nodeStyles : NodeContentStyles = {
    title: {
        maxHeight: "40px"
    },
    body: {
        height: "100%"
    },
    footer: {
        maxHeight: "30%"
    }
}

export default class Node extends PureComponent<NodeProps & NodeCoreProps, NodeState> {

    public inputs : Input[] = [];
    public outputs : Output[] = [];

    private _node : NodeSkeleton;

    get position() : XYCoords {
        return this._node.position;
    }

    private renderTitle = () : JSX.Element | null => {
        return (
            <div style={{display: "inline-flex"}}>
                <span>{"<Node Title>"}</span>
            </div>
        );
    }

    private renderBody = (toggleFooter: Function) : JSX.Element | null => {
        return (
            <div className="IO">
                <div className="inputs">
                    <Input node={this} ref={(i : Input) => this.inputs.push(i)} label="input" onSocketClick={this.onSocketClick} />
                </div>
                <div className="outputs">
                    <Output node={this} label="output" onSocketClick={this.onSocketClick} />
                </div>
            </div>
        );
    }

    private onSocketClick = (e: MouseEvent, socket: Socket) : void => {

        const { canvas } = this.props;

        const position = this.position;
        console.log(position, socket.center, canvas.offset);
        const [nodeX, nodeY] = position;
        const [x, y] = socket.center;
        const [offsetX, offsetY] = [0, 0];//canvas.offset;
        canvas.addTest([nodeX + x - offsetX, nodeY + y - offsetY]);

    }

    private renderFooter = (toggleFooter: Function) : JSX.Element | null => {
        return (
            null
        );
    }

    public render() {

        const { size, position } = this.props;

        return (
            <NodeSkeleton ref={(n) => this._node = n!} position={position} size={size} title={this.renderTitle} body={this.renderBody} 
                footer={this.renderFooter} contentStyles={nodeStyles} expandSize={100}
            />
        )
    }

}