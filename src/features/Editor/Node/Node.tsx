import React, { PureComponent } from "react";

import "./Node.scss";
import NodeSkeleton, { NodeContentStyles } from "./NodeSkeleton/NodeSkeleton";
import Input from "./IO/Input/Input";
import Output from "./IO/Output/Output";
import { XYCoords } from "../utils/types";

export type NodeProps = {
    size: [number, number];
    position?: XYCoords;
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

export default class Node extends PureComponent<NodeProps, NodeState> {

    public inputs : Input[] = [];
    public outputs : Output[] = [];

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
                    <Input node={this} ref={(i : Input) => this.inputs.push(i)} label="input" />
                    <Input node={this} label="input 1" />
                    <Input node={this} label="input 2" />
                </div>
                <div className="outputs">
                    <Output node={this} label="output" />
                    <Output node={this} label="output 2" />
                    <Output node={this} label="output 3" />
                </div>
            </div>
        );
    }

    private renderFooter = (toggleFooter: Function) : JSX.Element | null => {
        return (
            null
        );
    }

    public render() {

        const { size, position } = this.props;

        return (
            <NodeSkeleton position={position} size={size} title={this.renderTitle} body={this.renderBody} 
                footer={this.renderFooter} contentStyles={nodeStyles} expandSize={100}
            />
        )
    }

}