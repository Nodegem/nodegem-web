import React from "react";
import { PureComponent } from "react";

import "./Node.scss";
import { Vector2 } from "../Draggable/utils/types";

interface NodeProps {
    size: Vector2;
}

interface NodeState {
    isFocused: boolean;
}

export default class Node extends PureComponent<NodeProps, NodeState> {

    public render() {

        const { size, ...rest } = this.props;

        return (
            <foreignObject {...rest} width={size.x} height={size.y}>
                <div className="node">Hello Node</div>
            </foreignObject>
        )
    }

}