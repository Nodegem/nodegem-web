import React, { PureComponent } from "react";
import Canvas, { CanvasProps } from "../Canvas/Canvas";
import Node from '../Node/Node';
import Link from "../Link/Link";
import Socket from "../Link/Socket/Socket";
import { XYCoords } from "../utils/types";

import "./NodeCanvas.scss";

export type NodeCanvasProps = {

}

type test = {
    startPos: XYCoords;
    destPos: XYCoords;
}

export type NodeCanvasState = {
    nodes: {}[];
    links: test[];
}

export default class NodeCanvas extends PureComponent<NodeCanvasProps & CanvasProps, NodeCanvasState> {

    private _canvas : Canvas;

    state = {
        nodes: [],
        links: []
    }

    public convertCoords = (coords: XYCoords) : XYCoords => {
        return this._canvas.svgPoint(this._canvas.container, coords);
    }

    public reset = () : void => {
        this._canvas.reset();
    }

    public addLink = (s: XYCoords, d: XYCoords) : void => {
        //TODO
        this.setState(prevState => ({
            links: [...prevState.links, {startPos: s, destPos: d}]
        }));
    }

    public addNode = () : void => {
        //TODO
    }

    public render() {

        const { ...rest } = this.props;
        const { nodes, links } = this.state;

        return (
            <Canvas ref={(c: Canvas) => this._canvas = c} {...rest}>
                <g id="_link-container">
                    {links.map((l: test, index) => {
                        return <Link canvas={this} key={index} startPos={l.startPos} destPos={l.destPos} color="red"/>
                    })}
                </g>
                <g id="_node-container">
                    <Node canvas={this} size={[200, 200]} inputs={[{}]} outputs={[{}]} />
                </g>
            </Canvas>
        );
    }

}