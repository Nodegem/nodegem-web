import React, { PureComponent } from "react";
import Canvas, { CanvasProps } from "../Canvas/Canvas";
import Node from '../Node/Node';
import Spline from "../Spline/Spline";
import { XYCoords } from "../utils/types";
import { addEvent, removeEvent } from "../Draggable/utils";
import Output from "../Node/IO/Output/Output";
import Input from "../Node/IO/Input/Input";
import update from 'immutability-helper';

import "./NodeCanvas.scss";

export type CanvasData = {
    nodes: { [nodeId: string] : NodeData };
    connectors: ConnectorData[];
}

export type NodeData = {
    id: string;
    title: string;
    inputs: {name: string}[];
    outputs: {name: string}[];
    position: XYCoords;
}

export type ConnectorData = {
    sourceNode: string;
    endNode: string;
}

export type NodeCanvasProps = {

}

export type NodeCanvasState = {
    data: CanvasData;
    dragging: boolean;
    position: XYCoords;
    source: {nodeId: string, source: XYCoords};
}

type CombineProps = NodeCanvasProps & CanvasProps;

export default class NodeCanvas extends PureComponent<CombineProps, NodeCanvasState> {

    private _canvas : Canvas;

    public get baseCanvas() : Canvas {
        return this._canvas;
    }

    constructor(props: CombineProps) {
        super(props);

        this.state = {
            data: {
                nodes: {
                    "dsa": { id: "1", title: "goodbye", inputs: [{ name: "Input" }], outputs: [{name: "Output"}], position: [200, 200] },
                    "thing": { id: "2", title: "hello", inputs: [{ name: "Input" }], outputs: [{name: "Output"}], position: [400, 550] }
                },
                connectors: []
            },
            dragging: false,
            position: [0, 0],
            source: {nodeId: "", source:[0, 0]}
        }
    }

    componentDidMount() {
        addEvent(document, "mousemove", this.handleMouseMove);
        addEvent(document, "mouseup", this.handleMouseUp);
    }

    componentWillUnmount() {
        removeEvent(document, "mousemove", this.handleMouseMove);
        removeEvent(document, "mouseup", this.handleMouseUp);
    }

    public toCanvasCoords = (coords: XYCoords) : XYCoords => {
        return this._canvas.svgPoint(this._canvas.container, coords);
    }

    public reset = () : void => {
        this._canvas.reset();
    }

    private handleMouseMove = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        const {clientX, clientY} = e;

        this.setState({position: this.toCanvasCoords([clientX, clientY])});
    }

    private handleMouseUp = (e: React.MouseEvent) => {
        //This is totes a hack to get around the event call order
        setTimeout(() => this.setState({dragging: false}), 1);
    }

    private handleCompleteConnector = (e: React.MouseEvent, input: Input, node: Node) => {
        const { dragging } = this.state;
        if(dragging) {

            const { source } = this.state;
            const destination = this.toCanvasCoords(input.anchorPoint);
            const newConnector : ConnectorData = {sourceNode: source.nodeId, endNode: node.props.id};

            const newState = update(this.state, {
                data: {
                    connectors: {
                        $push: newConnector
                    }
                }
            });
            this.setState(newState);
        }
        this.setState({dragging: false});
    }

    private handleStartConnector = (e: React.MouseEvent, output: Output, node: Node) => {
        const sourcePos = this.toCanvasCoords(output.anchorPoint);
        this.setState({dragging: true, source: {nodeId: node.props.id, source: sourcePos}});
    }

    private handleNodeMove = (e: React.MouseEvent, node: Node) => {
        // this.setState({})
    }

    private getNodeById = (id: string) : NodeData => {
        return this.state.data.nodes[id];
    }

    public render() {

        const { ...rest } = this.props;
        const { data, dragging, position, source } = this.state;
        const { nodes, connectors } = data;

        return (
            <Canvas ref={(c: Canvas) => this._canvas = c} {...rest}>
                <g id="_link-container">
                    {connectors.map((connector: ConnectorData, index: number) => {
                        const start = this.getNodeById(connector.sourceNode).position;
                        const end = this.getNodeById(connector.endNode).position;
                        return <Spline key={index} start={start} end={end} />
                    })}
                    {dragging && (
                        <Spline start={source.source} end={position} />
                    )}
                </g>
                <g id="_node-container">
                    {Object.keys(nodes).map((key: string, index: number) => {
                        const node = nodes[key];
                        return <Node key={index} size={[200, 200]}
                            onCompleteConnector={this.handleCompleteConnector} onStartConnector={this.handleStartConnector}
                            onDrag={this.handleNodeMove}
                            {...node}
                            />
                    })}
                </g>
            </Canvas>
        );
    }

}