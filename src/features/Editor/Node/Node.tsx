import React, { PureComponent } from "react";
import NodeSkeleton, { NodeContentStyles } from "./NodeSkeleton/NodeSkeleton";
import Input from "./IO/Input/Input";
import Output from "./IO/Output/Output";
import NodeCanvas from "../NodeCanvas/NodeCanvas";
import Socket from "../Link/Socket/Socket";
import { NodeCoreProps } from "./NodeCore/NodeCore";
import { XYCoords } from "../utils/types";

import "./Node.scss";

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

        const { inputs, outputs } = this.props;
        const hasInputs = inputs.length > 0;
        const hasOutputs = outputs.length > 0;

        return (
            <div className="IO">
                { hasInputs && 
                    (
                        <div className="inputs">
                            {inputs.map((x, index) =>
                                <Input node={this} key={index} ref={(i : Input) => this.inputs.push(i)} label="input" onSocketClick={this.onSocketClick} />
                            )}
                        </div>
                    )
                }
                { hasOutputs && 
                    (
                        <div className="outputs">
                            {outputs.map((x, index) => 
                                <Output node={this} key={index} label="output" onSocketClick={this.onSocketClick} />
                            )}
                        </div>
                    )
                }
            </div>
        );
    }

    private onSocketClick = (e: MouseEvent, socket: Socket) : void => {

        const { canvas } = this.props;

        canvas.addLink(socket.center, [e.clientX, e.clientY]);
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