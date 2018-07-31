import React from "react";
import { PureComponent } from "react";

import "./Node.scss";

interface NodeProps {
    size: Vector2;
    originCoords?: Vector2;
}

interface NodeState {
    coords: Vector2;
    isFocused: boolean;
    dragging: boolean;
}

export default class Node extends PureComponent<NodeProps, NodeState> {

    static defaultProps : Partial<NodeProps> = {
        originCoords: {x: 0, y: 0}
    }

    constructor(props: NodeProps) {
        super(props);

        const { originCoords } = this.props;

        this.state = {
            coords: originCoords as Vector2,
            isFocused: false,
            dragging: false
        };
    }

    public render() {

        const { size } = this.props;
        const { coords } = this.state;

        return (
            <foreignObject x={coords.x} y={coords.y} width={size.x} height={size.y}>
                <div className="node">Hello Node</div>
            </foreignObject>
        )
    }

}