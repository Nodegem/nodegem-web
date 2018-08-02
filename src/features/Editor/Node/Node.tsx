import React from "react";
import { PureComponent } from "react";

import "./Node.scss";
import { Vector2 } from "../Draggable/utils/types";
import Draggable from "../Draggable/Draggable";
import NodeShell from "./NodeShell/NodeShell";

interface NodeProps {
    size: [number, number];
}

interface NodeState {
    isFocused: boolean;
}

export default class Node extends PureComponent<NodeProps, NodeState> {

    public render() {

        const { size, ...rest } = this.props;

        return (
            <NodeShell size={size}>
                Hello
            </NodeShell>
        )
    }

}