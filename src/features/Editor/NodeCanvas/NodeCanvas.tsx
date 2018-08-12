import React, { PureComponent } from "react";
import Canvas, { CanvasProps } from "../Canvas/Canvas";
import Node, { NodeProps } from '../Node/Node';
import Link, { LinkProps } from "../Link/Link";
import { XYCoords } from "../utils/types";

import "./NodeCanvas.scss";

export type NodeCanvasProps = {

}

export type NodeCanvasState = {
    nodes: Omit<NodeProps, "canvas" | "inputs" | "outputs">[];
    links: LinkProps[];
}

export default class NodeCanvas extends PureComponent<NodeCanvasProps & CanvasProps, NodeCanvasState> {

    private _canvas : Canvas;

    state = {
        nodes: [
            {
                inputs: [{}],
                outputs: [{}]
            },
            {
                inputs: [{}],
                outputs: [{}]
            }
        ],
        links: []
    }

    public toCanvasCoords = (coords: XYCoords) : XYCoords => {
        return this._canvas.svgPoint(this._canvas.container, coords);
    }

    public reset = () : void => {
        this._canvas.reset();
    }

    public addLink = (props: Omit<LinkProps, "canvas">) : void => {
        //TODO
        this.setState(prevState => ({
            links: [...prevState.links, {...props as LinkProps}]
        }));
    }

    public deleteLink = () : void => {
        //TODO
    }

    public addNode = () : void => {
        //TODO
    }

    public deleteNode = () : void => {
        //TODO
    }

    public render() {

        const { ...rest } = this.props;
        const { nodes, links } = this.state;

        return (
            <Canvas ref={(c: Canvas) => this._canvas = c} {...rest}>
                <g id="_link-container">
                    {links.map((l: LinkProps, index) => {
                        return <Link canvas={this} key={index} {...l} />
                    })}
                </g>
                <g id="_node-container">
                    {nodes.map((n: NodeProps, index) => {
                        return <Node canvas={this} key={index} size={[200, 200]} position={[200 + (index * 400), 250 + (index * 200)]} {...n} />
                    })}
                </g>
            </Canvas>
        );
    }

}