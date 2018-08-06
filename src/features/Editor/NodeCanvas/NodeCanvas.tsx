import React, { PureComponent } from "react";
import Canvas, { CanvasProps } from "../Canvas/Canvas";
import Node from '../Node/Node';

import "./NodeCanvas.scss";
import Link from "../Link/Link";

export type NodeCanvasProps = {

}

export type NodeCanvasState = {
    nodes: {}[];
    links: {}[];
}

export default class NodeCanvas extends PureComponent<NodeCanvasProps & CanvasProps, NodeCanvasState> {

    private _canvas : Canvas;

    state = {
        nodes: [],
        links: []
    }

    public reset = () : void => {
        this._canvas.reset();
    }

    public addLink = () : void => {
        //TODO
        this.setState(prevState => ({
            links: [...prevState.links, {}]
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
                    {links.map((l, index) => {
                        return <Link key={index} anchor={[0, 0]} color="red"/>
                    })}
                </g>
                <g id="_node-container">
                    <Node canvas={this} size={[200, 200]} inputs={[]} outputs={[]} />
                </g>
            </Canvas>
        );
    }

}