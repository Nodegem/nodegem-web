import React, { Component } from "react";
import Canvas, { CanvasProps } from "../Canvas/Canvas";
import Node, { NodeMetaData } from '../Node/Node';
import Spline from "../Spline/Spline";
import { XYCoords } from "../utils/types";
import { addEvent, removeEvent } from "../Draggable/utils";
import Output from "../Node/IO/Output/Output";
import Input from "../Node/IO/Input/Input";
import update from 'immutability-helper';
import { ConnectorData, CanvasData, NodeData } from "./types";
import { distance } from '../utils';

import "./NodeCanvas.scss";

export type NodeCanvasProps = {
    data: CanvasData;
}

export type NodeCanvasState = {
    nodes: { [nodeId: string] : NodeData };
    connectors: ConnectorData[];
    dragging: boolean;
    nodeDragging: boolean; //I don't like this
    nodesRendered: boolean; // I don't like this
    position: XYCoords;
    source: {nodeId: string, sourceFieldId: string, position: XYCoords};
}

type CombineProps = NodeCanvasProps & CanvasProps;

export default class NodeCanvas extends Component<CombineProps, NodeCanvasState> {

    private _canvas : Canvas;
    private _nodes: {[nodeId: string]: Node};

    public get baseCanvas() : Canvas {
        return this._canvas;
    }

    constructor(props: CombineProps) {
        super(props);

        this.state = {
            nodes: props.data.nodes,
            connectors: props.data.connectors,
            dragging: false,
            nodeDragging: false,
            nodesRendered: false,
            position: [0, 0],
            source: {nodeId: "", sourceFieldId: "", position:[0, 0]}
        }

        this._nodes = {};
    }

    componentDidMount() {
        addEvent(document, "mousemove", this.handleMouseMove);
        addEvent(document, "mouseup", this.handleMouseUp);

        setTimeout(this.onLoaded, 50);
    }

    //This is utter bullshit but the only way I can get it to render properly
    private onLoaded = () => {

        for(let connector of this.props.data.connectors) {
            
            const sourceField = this.getFieldById(connector.sourceNode, connector.sourceFieldId);
            const endField = this.getFieldById(connector.endNode, connector.endFieldId);

            sourceField.setConnected(true);
            endField.setConnected(true);
        }

        this.setState({nodesRendered: true});
    }

    componentWillUnmount() {
        removeEvent(document, "mousemove", this.handleMouseMove);
        removeEvent(document, "mouseup", this.handleMouseUp);
    }

    shouldComponentUpdate(nextProps : CombineProps, nextState : NodeCanvasState) : boolean {

        const { nodeDragging, dragging } = this.state;

        if((dragging || nodeDragging) && this.state.position !== nextState.position
            || this.state.nodesRendered !== nextState.nodesRendered
            || this.state.dragging !== nextState.dragging) 
        {
            return true;
        }

        return false;
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

        const {source} = this.state;
        if(source.nodeId) {
            const field = this.getFieldById(source.nodeId, source.sourceFieldId);
            //TODO
            if(field) {
                field.setConnected(false);
            }
        }

        //This is totes a hack to get around the event call order
        setTimeout(() => this.setState({dragging: false}), 1);
    }

    private handleCompleteConnector = (e: React.MouseEvent, input: Input, node: Node) => {
        const { dragging } = this.state;
        if(dragging) {

            const { source } = this.state;
            const newConnector : ConnectorData = {
                sourceNode: source.nodeId,
                sourceFieldId: source.sourceFieldId,
                endNode: node.props.id,
                endFieldId: input.props.id
            };

            const newState = update(this.state, {
                connectors: {
                    $push: [newConnector]
                }
            });

            this.setState(newState);
            input.setConnected(true);
        }
        this.setState({dragging: false});
    }

    private handleStartConnector = (e: React.MouseEvent, output: Output, node: Node) => {
        const sourcePos = this.toCanvasCoords(output.anchorPoint);
        output.setConnected(true);
        this.setState({dragging: true, source: {nodeId: node.props.id, sourceFieldId: output.props.id, position: sourcePos}});
    }

    private handleNodeDragStart = (e: React.MouseEvent, node: Node, data: NodeMetaData) => {
    }

    private handleNodeMove = (e: React.MouseEvent, node: Node, data: NodeMetaData) => {
        const newNodeState = update(this.state.nodes, {
            [node.props.id]: {
                position: {
                    $set: data.position
                }
            }
        });
        this.setState({
            nodes: newNodeState,
            nodeDragging: true
        });
    }

    private handleNodeDragStop = (e: React.MouseEvent, node: Node, data: NodeMetaData) => {
        this.setState({nodeDragging: false});
    }

    private getNodeById = (id: string) : Node => {
        return this._nodes[id];
    }

    private getFieldById = (nodeId: string, fieldId: string) : Output | Input => {
        const node = this.getNodeById(nodeId);
        return node.getFieldById(fieldId)!;
    }

    private getFieldPositionById = (nodeId: string, fieldId: string) : XYCoords => {
        return this.getFieldById(nodeId, fieldId).anchorPoint;
    }

    private splineTransform = (values: XYCoords[]) : XYCoords[] => {
        const offset = 30;
        const [startX, startY] = values[0];
        const [endX, endY] = values[1];
        return [
            [startX, startY],
            [startX + offset, startY],
            [endX - offset, endY],
            [endX, endY]
        ];
    }

    public render() {

        const { ...rest } = this.props;
        const { nodes, connectors, dragging, position, source, nodesRendered } = this.state;

        return (
            <Canvas ref={(c: Canvas) => this._canvas = c} {...rest}>
                <g id="_link-container">
                    {nodesRendered && 
                        connectors.map((connector: ConnectorData, index: number) => {
                            const start = this.getFieldPositionById(connector.sourceNode, connector.sourceFieldId);
                            const end = this.getFieldPositionById(connector.endNode, connector.endFieldId);
                            return <Spline key={index} linkTransform={this.splineTransform} start={this.toCanvasCoords(start)} end={this.toCanvasCoords(end)} />
                        })
                    }
                    {dragging && (
                        <Spline start={source.position} end={position} linkTransform={this.splineTransform} />
                    )}
                </g>
                <g id="_node-container">
                    {Object.keys(nodes).map((key: string, index: number) => {
                        const node = nodes[key];
                        return <Node ref={(n: Node) => this._nodes[node.id] = n} key={index} size={[200, 200]}
                            onCompleteConnector={this.handleCompleteConnector} onStartConnector={this.handleStartConnector}
                            onDrag={this.handleNodeMove} onDragStart={this.handleNodeDragStart} onDragStop={this.handleNodeDragStop}
                            {...node}
                        />
                    })}
                </g>
            </Canvas>
        );
    }

}