import React, { Component } from "react";
import Canvas, { CanvasProps } from "../Canvas/Canvas";
import Node, { NodeMetaData } from '../Node/Node';
import Spline from "../Spline/Spline";
import { XYCoords } from "../utils/types";
import { addEvent, removeEvent } from "../Draggable/utils";
import Output from "../Node/IO/Output/Output";
import Input from "../Node/IO/Input/Input";
import { ConnectorData, CanvasData } from "./types";

import "./NodeCanvas.scss";

export type NodeCanvasProps = {
    data: CanvasData;
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
    }

    componentDidMount() {

        addEvent(document, "mousemove", this.handleMouseMove);
        addEvent(document, "mouseup", this.handleMouseUp);

        setTimeout(this.onLoaded, 50);
    }

    //This is utter bullshit but the only way I can get it to render properly
    private onLoaded = () => {

        for (let connector of this.props.data.connectors) {

            const sourceField = this.getFieldById(connector.sourceNodeId, connector.sourceFieldId);
            const endField = this.getFieldById(connector.toNodeId, connector.toFieldId);

            sourceField.setConnected(true);
            endField.setConnected(true);
        }

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
            || this.props.data !== nextProps.data) {
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
            const { source } = this.state;
            if (source && source.nodeId) {
                const hasExistingConnection = this.props.data.connectors.some(x => x.sourceNodeId === source.nodeId);
                const field = this.getFieldById(source.nodeId, source.sourceFieldId);
                if (field && !hasExistingConnection) {
                    field.setConnected(false);
                }
            }

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
        output.setConnected(true);
        this.setState({ dragging: true, source: { nodeId: node.props.id, sourceFieldId: output.props.id, position: sourcePos } });
    }

    private handleCompleteConnector = (e: React.MouseEvent, input: Input, node: Node) => {
        const { dragging } = this.state;
        if (dragging) {
            const { source } = this.state;
            this.props.onNewConnector!({sourceNodeId: source!.nodeId, sourceFieldId: source!.sourceFieldId, toNodeId: node.props.id, toFieldId: input.props.id}, e);
            input.setConnected(true);
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

    private getFieldPositionById = (nodeId: string, fieldId: string): XYCoords => {
        return this.getFieldById(nodeId, fieldId).anchorPoint;
    }

    public render() {

        const { size, pattern, fillId, className, onZoom, resetTransitionTime, zoomRange, zoomInputFilter, data, onCanvasRightClick } = this.props;
        const { dragging, position, source, nodesRendered } = this.state;
        const props = {pattern, fillId, className, onZoom, resetTransitionTime, zoomRange, zoomInputFilter };

        const { nodes, connectors } = data;

        return (
            <Canvas ref={(c: Canvas) => this._canvas = c} size={size} onRightClick={onCanvasRightClick} {...props}>
                <g id="_link-container">
                    {nodesRendered &&
                        connectors.map((connector: ConnectorData, index: number) => {
                            const start = this.getFieldPositionById(connector.sourceNodeId, connector.sourceFieldId);
                            const end = this.getFieldPositionById(connector.toNodeId, connector.toFieldId);
                            return <Spline key={index} linkTransform={this.splineTransform} 
                                onClick={(e) => this.handleSplineClick(e, connector)} onClickOutside={(e) => this.handleSplineBlur(e, connector)} 
                                onRightClick={(e) => this.handleSplineRightClick(e, connector)}
                                start={this.toCanvasCoords(start)} end={this.toCanvasCoords(end)} />
                        })
                    }
                    {(dragging && source) && (
                        <Spline start={source.position} end={position} linkTransform={this.splineTransform} />
                    )}
                </g>
                <g id="_node-container">
                    {Object.keys(nodes).map((key: string, index: number) => {
                        const node = nodes[key];
                        return <Node ref={(n: Node) => this._nodes[node.id] = n} key={index}
                            onCompleteConnector={this.handleCompleteConnector} onStartConnector={this.handleStartConnector}
                            onDrag={this.handleNodeMove} onDragStart={this.handleNodeDragStart} onDragStop={this.handleNodeDragStop}
                            onBlur={this.handleNodeBlur} onDoubleClick={this.handleNodeDoubleClick}
                            onRightClick={this.handleNodeRightClick}
                            {...node}
                        />
                    })}
                </g>
            </Canvas>
        );
    }

}