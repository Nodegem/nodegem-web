import React, { PureComponent } from "react";

import "./Node.scss";
import NodeSkeleton, { NodeContentStyles } from "./NodeSkeleton/NodeSkeleton";
import { Icon } from "antd";
import Socket, { SocketCSSProps } from "../Link/Socket/Socket";
import Input from "./IO/Input/Input";

export type NodeProps = {
    size: [number, number];
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

    private renderBody = (toggleFooter: Function, footerVisibility: boolean) : JSX.Element | null => {
        return (
            <div className="IO">
                <div className="inputs">
                    <Input label="input" />
                    <Input label="input 1" />
                    <Input label="input 2" />
                </div>
                <div className="outputs">

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

        const { size } = this.props;

        return (
            <NodeSkeleton size={size} title={this.renderTitle} body={this.renderBody} 
                footer={this.renderFooter} contentStyles={nodeStyles} expandSize={100}
            />
        )
    }

}