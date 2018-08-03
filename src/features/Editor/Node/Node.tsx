import React, { PureComponent } from "react";

import "./Node.scss";
import NodeSkeleton, { NodeContentStyles } from "./NodeSkeleton/NodeSkeleton";
import { Icon } from "antd";
import Socket, { SocketCSSProps } from "../Link/Socket/Socket";

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
            maxHeight: "40%"
        },
        collapsed: {
            maxHeight: "20px"
        }
    }
}

export default class Node extends PureComponent<NodeProps, NodeState> {

    static defaultProps = {
    }

    state = {
    }

    private renderTitle = () : JSX.Element | null => {
        const test : SocketCSSProps = {
            socket: {
                backgroundColor: "white"
            },
            selected: {
                backgroundColor: "black"
            }
        };

        return (
            <div style={{display: "inline-flex"}}>
                <Socket size={[15, 15]} style={test} />
                <span>{"<Node Title>"}</span>
            </div>
        );
    }

    private renderBody = (toggleFooter: Function, footerVisibility: boolean) : JSX.Element | null => {
        return (
            null
        );
    }

    private renderFooter = (toggleFooter: Function) : JSX.Element | null => {
        return (
            null
        );
    }

    private renderCollapseFooter = (toggleFooter: Function, footerVisibility: boolean) : JSX.Element | null => {
        return (
            null
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