import React, { PureComponent } from "react";

import "./Node.scss";
import NodeSkeleton, { NodeContentStyles } from "./NodeSkeleton/NodeSkeleton";

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
        visible: {
            height: "40%"
        },
        collapsed: {
            height: "20px"
        }
    }
}

export default class Node extends PureComponent<NodeProps, NodeState> {

    static defaultProps = {
    }

    state = {
    }

    private renderTitle = () : JSX.Element | null => {
        return <span>Hello</span>;
    }

    private renderBody = (toggleFooter: Function, footerVisibility: boolean) : JSX.Element | null => {
        return <button onClick={() => toggleFooter()}>Show!</button>;
    }

    private renderFooter = (toggleFooter: Function) : JSX.Element | null => {
        return (
            <button onClick={() => toggleFooter()}>Hide!</button>
        );
    }

    private renderCollapseFooter = (toggleFooter: Function, footerVisibility: boolean) : JSX.Element | null => {
        return (
            <button onClick={() => toggleFooter()}>Collapsed</button>
        );
    }

    public render() {

        const { size } = this.props;

        return (
            <NodeSkeleton size={size} title={this.renderTitle} body={this.renderBody} 
                footer={this.renderFooter} footerCollapseHandle={this.renderCollapseFooter}
                contentStyles={nodeStyles} expandSize={100}
            />
        )
    }

}