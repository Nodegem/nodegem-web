import React from "react";
import { PureComponent } from "react";

import "./Node.scss";

interface NodeProps {
    width: number;
    height: number;
    originCoords?: Coord;
}

interface NodeState {
    coords: Coord;
}

export default class Node extends PureComponent<NodeProps, NodeState> {

    constructor(props: NodeProps) {
        super(props);

        const origCoords : Coord = this.props.originCoords || {x: 0, y: 0};

        this.state = {
            coords: origCoords
        };
    }

    public render() {

        const { width, height } = this.props;
        const { coords } = this.state;

        return (
            <foreignObject x={coords.x} y={coords.y} width={width} height={height}>
                <div className="node">Hello Node</div>
            </foreignObject>
        )
    }

}