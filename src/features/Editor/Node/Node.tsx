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
                    <Input label="input" />
                    <Input label="input 1" />
                    <Input label="input 2" />
                </div>
                <div className="outputs">
                    <Output label="output" />
                    <Output label="output 2" />
                    <Output label="output 3" />
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