import React, { Component } from "react";
import Canvas, { CanvasProps } from "../Canvas/Canvas";
import Node, { NodeMetaData, ConnectedFieldType } from '../Node/Node';
import Spline from "../Spline/Spline";
import { XYCoords } from "../utils/types";
import { addEvent, removeEvent } from "../Draggable/utils";
import Output from "../Node/IO/Output/Output";
import Input from "../Node/IO/Input/Input";
import { ConnectorData, CanvasData, NodeData } from "./types";

import "./NodeCanvas.scss";

export type NodeCanvasProps = {
    data: CanvasData;
    cameraTransform?: [number, number, number];
    onCanvasRightClick?: (e: React.MouseEvent) => void;
    onNewConnector?: (connector: ConnectorData, e: React.MouseEvent) => void;
    onConnectorSelect?: (connector: ConnectorData, e: React.MouseEvent) => void;
    onConnectorDeselect?: (connector: ConnectorData, e: React.MouseEvent) => void;
    onConnectorRightClick?: (connector: ConnectorData, e: React.MouseEvent) => void;
    onNodeMove?: (id: string, position: XYCoords) => void;
    onNodeMoveStop?: (id: string, position: XYCoords) => void;
    onNodeSelect?: (id: string, e: React.MouseEvent) => void;
    onNodeDeselect?: (id: string, e: React.MouseEvent) => void;
    onNodeDoubleClick?: (id: string, e: React.MouseEvent) => void;
    onNodeRightClick?: (id: string, e: React.MouseEvent) => void;
}

export type NodeCanvasState = {
    dragging: boolean;
    nodeDragging: boolean; //I don't like this
    nodesRendered: boolean; // I don't like this
    position: XYCoords;
    source?: { nodeId: string, sourceFieldId: string, position: XYCoords };
}

type CombineProps = NodeCanvasProps & CanvasProps;

export default class NodeCanvas extends Component<CombineProps, NodeCanvasState> {

    private _canvas: Canvas;
    private _nodes: { [nodeId: string]: Node };

    private _connectedFields : { [nodeId: string] : ConnectedFieldType };

    public get baseCanvas(): Canvas {
        return this._canvas;
    }

    static defaultProps : Partial<NodeCanvasProps> = {
        onCanvasRightClick: () => {},
        onNewConnector: () => {},
        onConnectorSelect: () => {},
        onConnectorDeselect: () => {},
        onNodeMove: () => {},
        onNodeMoveStop: () => {},
        onNodeDeselect: () => {},
        onNodeSelect: () => {},
        onNodeDoubleClick: () => {}
    }

    constructor(props: CombineProps) {
        super(props);

        this.state = {
            dragging: false,
            nodeDragging: false,
            nodesRendered: false,
            position: [0, 0]
        }

        this._nodes = {};
        this.generateNodeConnections(props.data);
    }

    componentDidMount() {

        addEvent(document, "mousemove", this.handleMouseMove);
        addEvent(document, "mouseup", this.handleMouseUp);

        setTimeout(this.onLoaded, 50);

        if(this.props.cameraTransform) {
            const [x, y, scale] = this.props.cameraTransform;
            this._canvas.setCameraTransform({x, y, scale});
        }
    }

    private generateNodeConnections = (newData: CanvasData) => {
        const { nodes, connectors } = newData;
        this._connectedFields = nodes
            .reduce((acc, val) => {
                acc[val.id] = connectors
                    .filter(x => x.sourceNodeId === val.id || x.toNodeId === val.id)
                    .reduce((cAcc, cVal) => 
                    {
                        if(cVal.sourceNodeId === val.id) {
                            const newVal = cAcc.outputs[cVal.sourceFieldId];
                            if(!newVal) cAcc.outputs[cVal.sourceFieldId] = 1;
                            else cAcc.outputs[cVal.sourceFieldId] += 1;
                        }
                        else {
                            const newVal = cAcc.inputs[cVal.toFieldId];
                            if(!newVal) cAcc.inputs[cVal.toFieldId] = 1;
                            else cAcc.inputs[cVal.toFieldId] += 1;
                        }
                        return cAcc;
                }, { inputs: {}, outputs: {} } as ConnectedFieldType)
                return acc;
            }, {})
    }

    //This is utter bullshit but the only way I can get it to render properly
    private onLoaded = () => {
        this.setState({ nodesRendered: true });
    }

    componentWillUnmount() {
        removeEvent(document, "mousemove", this.handleMouseMove);
        removeEvent(document, "mouseup", this.handleMouseUp);
    }

    shouldComponentUpdate(nextProps: CombineProps, nextState: NodeCanvasState): boolean {

        const { nodeDragging, dragging } = this.state;

        if ((dragging || nodeDragging) && this.state.position !== nextState.position
            || this.state.nodesRendered !== nextState.nodesRendered
            || this.state.dragging !== nextState.dragging
            || this.props.data !== nextProps.data) 
        {
        
            if(this.props.data.connectors !== nextProps.data.connectors
                || this.props.data.nodes !== nextProps.data.nodes) {
                    this.generateNodeConnections(nextProps.data);
                } 

            return true;
        }

        return false;
    }

    public toCanvasCoords = (coords: XYCoords): XYCoords => {
        return this._canvas.svgPoint(this._canvas.container, coords);
    }

    public reset = (): void => {
        this._canvas.reset();
    }

    private handleMouseMove = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        const { clientX, clientY } = e;
        this.setState({ position: this.toCanvasCoords([clientX, clientY]) });
    }

    private handleMouseUp = (e: React.MouseEvent) => {

        //This is totes a hack to get around the event call order
        setTimeout(() => {
            this.setState({ dragging: false });
        }, 1)

    }

    //#region Node Handlers
    private handleNodeDragStart = (e: React.MouseEvent, node: Node, data: NodeMetaData) => {
        this.props.onNodeSelect!(node.props.id, e);
    }

    private handleNodeMove = (e: React.MouseEvent, node: Node, data: NodeMetaData) => {
        this.props.onNodeMove!(node.props.id, data.position);
        this.setState({
            nodeDragging: true
        });
    }

    private handleNodeDragStop = (e: React.MouseEvent, node: Node, data: NodeMetaData) => {
        this.props.onNodeMoveStop!(node.props.id, data.position);
        this.setState({ nodeDragging: false });
    }

    private handleNodeDoubleClick = (e: React.MouseEvent, node: Node) => {
        this.props.onNodeDoubleClick!(node.props.id, e);
    }

    private handleNodeBlur = (e: React.MouseEvent, node: Node) => {
        this.props.onNodeDeselect!(node.props.id, e);
    }

    private handleNodeRightClick = (e: React.MouseEvent, node: Node) => {
        this.props.onNodeRightClick!(node.props.id, e);
    }
    //#endregion

    //#region Spline Handlers

    private splineTransform = (values: XYCoords[]): XYCoords[] => {
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

    private handleStartConnector = (e: React.MouseEvent, output: Output, node: Node) => {
        const sourcePos = this.toCanvasCoords(output.anchorPoint);
        this.setState({ dragging: true, source: { nodeId: node.props.id, sourceFieldId: output.props.id, position: sourcePos } });
    }

    private handleCompleteConnector = (e: React.MouseEvent, input: Input, node: Node) => {
        const { dragging } = this.state;
        if (dragging) {
            const { source } = this.state;
            this.props.onNewConnector!(
                {sourceNodeId: source!.nodeId, sourceFieldId: source!.sourceFieldId, 
                    toNodeId: node.props.id, toFieldId: input.props.id}, e);
        }
        this.setState({ dragging: false });
    }

    private handleSplineClick = (e: React.MouseEvent, connector: ConnectorData) => {
        this.props.onConnectorSelect!(connector, e);
    }

    private handleSplineBlur = (e: React.MouseEvent, connector: ConnectorData) => {
        this.props.onConnectorDeselect!(connector, e);
    }

    private handleSplineRightClick = (e: React.MouseEvent, connector: ConnectorData) => {
        this.props.onConnectorRightClick!(connector, e);
    }

    //#endregion

    private getNodeById = (id: string): Node => {
        return this._nodes[id];
    }

    private getFieldById = (nodeId: string, fieldId: string): Output | Input => {
        const node = this.getNodeById(nodeId);
        return node.getFieldById(fieldId)!;
    }

    public render() {

        const { size, pattern, fillId, className, onZoomPan, resetTransitionTime, zoomRange, zoomInputFilter, data, onCanvasRightClick } = this.props;
        const { dragging, position, source, nodesRendered } = this.state;
        const props = {pattern, fillId, className, onZoomPan, resetTransitionTime, zoomRange, zoomInputFilter };

        const { nodes, connectors } = data;

        return (
            <Canvas ref={(c: Canvas) => this._canvas = c} size={size} onRightClick={onCanvasRightClick} {...props}>
                <g id="_link-container">
                    {nodesRendered &&
                        connectors.map((connector: ConnectorData, index: number) => {
                            const start = this.getFieldById(connector.sourceNodeId, connector.sourceFieldId);
                            const end = this.getFieldById(connector.toNodeId, connector.toFieldId);
                            return <Spline key={index} linkTransform={this.splineTransform} 
                                onClick={(e) => this.handleSplineClick(e, connector)} onClickOutside={(e) => this.handleSplineBlur(e, connector)} 
                                onRightClick={(e) => this.handleSplineRightClick(e, connector)}
                                start={this.toCanvasCoords(start.anchorPoint)} end={this.toCanvasCoords(end.anchorPoint)}
                                sourceField={start as Output} toField={end as Input} />
                        })
                    }
                    {(dragging && source) && (
                        <Spline start={source.position} end={position} linkTransform={this.splineTransform} />
                    )}
                </g>
                <g id="_node-container">
                    {nodes.map(node => {
                        return <Node ref={(n: Node) => this._nodes[node.id] = n} key={node.id}
                            onCompleteConnector={this.handleCompleteConnector} onStartConnector={this.handleStartConnector}
                            onDrag={this.handleNodeMove} onDragStart={this.handleNodeDragStart} onDragStop={this.handleNodeDragStop}
                            onBlur={this.handleNodeBlur} onDoubleClick={this.handleNodeDoubleClick}
                            onRightClick={this.handleNodeRightClick} connectedFields={this._connectedFields[node.id]}
                            {...node}
                        />
                    })}
                </g>
            </Canvas>
        );
    }

}