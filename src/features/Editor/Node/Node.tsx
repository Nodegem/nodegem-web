import React from "react";
import { PureComponent } from "react";

import "./Node.scss";
import { Vector2 } from "../Draggable/utils/types";
import Draggable from "../Draggable/Draggable";

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
            <Draggable handle=".handle">
                <foreignObject {...rest} width={size.x} height={size.y}>
                    <div className="node">
                        <span className="handle">
                            Hello Node
                        </span>
                    </div>
                </foreignObject>
            </Draggable>
        )
    }

}