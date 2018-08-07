import React, { PureComponent } from "react";
import Canvas, { CanvasProps } from "../Canvas/Canvas";
import Node from '../Node/Node';
import Link from "../Link/Link";
import Socket from "../Link/Socket/Socket";
import { XYCoords } from "../utils/types";
import TestCircle from "../Link/TestCircle";
import ReactDOM from "react-dom";

import "./NodeCanvas.scss";


export type NodeCanvasProps = {

}

type test = {
    socket: Socket;
}

type test2 = {
    pos: XYCoords;
}

export type NodeCanvasState = {
    nodes: {}[];
    links: test[];
    test: test2[];
}

export default class NodeCanvas extends PureComponent<NodeCanvasProps & CanvasProps, NodeCanvasState> {

    private _canvas : Canvas;

    state = {
        nodes: [],
        links: [],
        test: []
    }

    get offset() : [number, number] {
        const parent = (ReactDOM.findDOMNode(this) as Element).parentElement!;
        return [parent.offsetLeft, parent.offsetTop];
    }

    public reset = () : void => {
        this._canvas.reset();
    }

    public addLink = (socket: Socket) : void => {
        //TODO
        this.setState(prevState => ({
            links: [...prevState.links, {socket}]
        }));
    }

    public addNode = () : void => {
        //TODO
    }

    public addTest = (pos: XYCoords) : void => {
        this.setState(prevState => ({
            test: [...prevState.test, {pos}]
        }));
    }

    public render() {

        const { ...rest } = this.props;
        const { nodes, links, test } = this.state;

        return (
            <Canvas ref={(c: Canvas) => this._canvas = c} {...rest}>
                <g id="_link-container">
                    {links.map((l: test, index) => {
                        return <Link key={index} anchor={l.socket.center} color="red"/>
                    })}
                </g>
                <g id="_node-container">
                    <Node canvas={this} size={[200, 200]} inputs={[]} outputs={[]} />

                    {test.map((l: test2, index) => {
                        return <TestCircle key={index} position={l.pos} />
                    })}
                </g>
            </Canvas>
        );
    }

}