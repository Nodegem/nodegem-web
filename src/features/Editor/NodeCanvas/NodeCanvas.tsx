import React, { PureComponent } from "react";
import Canvas, { CanvasProps } from "../Canvas/Canvas";
import Node, { NodeProps } from '../Node/Node';
import Spline, { SplineProps } from "../Spline/Spline";
import { XYCoords } from "../utils/types";

import "./NodeCanvas.scss";

export type NodeCanvasProps = {

}

export type NodeCanvasState = {
    nodes: {}[];
    links: SplineProps[];
    dragging: boolean;
}

export default class NodeCanvas extends PureComponent<NodeCanvasProps & CanvasProps, NodeCanvasState> {

    private _canvas : Canvas;

    public get baseCanvas() : Canvas {
        return this._canvas;
    }

    state = {
        nodes: [
            {
                title: "test",
                inputs: [{name: "input"}],
                outputs: [{name: "output"}]
            },
            {
                title: "test 2",
                inputs: [{name: "input"}],
                outputs: [{name: "output"}]
            }
        ],
        links: [],
        dragging: true
    }

    public toCanvasCoords = (coords: XYCoords) : XYCoords => {
        return this._canvas.svgPoint(this._canvas.container, coords);
    }

    public reset = () : void => {
        this._canvas.reset();
    }

    public render() {

        const { ...rest } = this.props;
        const { nodes, links, dragging } = this.state;
        let newConnector : JSX.Element | null = null;

        if(dragging) {
            newConnector = (<Spline start={[50, 50]} end={[500, 500]}  />);
        }

        return (
            <Canvas ref={(c: Canvas) => this._canvas = c} {...rest}>
                <g id="_link-container">
                    {links.map((l: SplineProps, index) => {
                        return <Spline key={index} {...l} />
                    })}
                    {newConnector}
                </g>
                <g id="_node-container">
                    {nodes.map((n: NodeProps, index) => {
                        return <Node key={index} size={[200, 200]} position={[200 + (index * 400), 250 + (index * 200)]} {...n} />
                    })}
                </g>
            </Canvas>
        );
    }

}