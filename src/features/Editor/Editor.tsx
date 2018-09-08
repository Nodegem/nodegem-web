import React, { CSSProperties, Props } from "react";
import * as d3 from 'd3';
import { HotKeys } from "react-hotkeys";
import { isMac } from "../../utils";
import { ContextMenuTrigger, ContextMenu, MenuItem } from 'react-contextmenu';
import NodeCanvas from "./NodeCanvas/NodeCanvas";
import { CanvasData, ConnectorData, NodeData } from "./NodeCanvas/types";
import update from "immutability-helper";

import "./Editor.scss";
import "./ContextMenu/context-menu.scss";
import { ComponentBase } from "resub";
import { editorStore } from "../../stores/EditorStore";
import { NodeContextMenu, CanvasContextMenu, ConnectorContextMenu } from "./ContextMenu";
import { XYCoords } from "./utils/types";

enum EDITOR_KEY_COMMANDS {
    RESET = "RESET",
    FULLSCREEN = "FULLSCREEN",
    DELETE = "DELETE",
    TEST = "TEST"
}

const EDITOR_KEY_MAP = {
    [EDITOR_KEY_COMMANDS.RESET]: "space",
    [EDITOR_KEY_COMMANDS.FULLSCREEN]: ["ctrl+shift+space", "command+shift+space"],
    [EDITOR_KEY_COMMANDS.DELETE]: ["del", "backspace"],
    [EDITOR_KEY_COMMANDS.TEST]: ["enter"]

}

const canvasPattern = (size: number) => (
        <g>
            <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="lightgray" strokeWidth="0.5" />
            </pattern>
            <pattern id="grid" width={size} height={size} patternUnits="userSpaceOnUse">
                <rect width={size} height={size} fill="url(#smallGrid)" />
                <path d={`M ${size} 0 L 0 0 0 ${size}`} fill="none" stroke="gray" strokeWidth=".5" />
            </pattern>
        </g>
);

export type EditorProps = {
    size: [number, number];
    zoomRange: [number, number];
}

type CombinedProps = EditorProps & Props<any>;

type EditorState = {
    data: CanvasData;
    cameraTransform?: [number, number, number];
    contextData?: JSX.Element;
    selectedNodeIds?: string[];
}

class Editor extends ComponentBase<CombinedProps, EditorState> {

    private _canvas: NodeCanvas;

    protected _buildState(props: CombinedProps) : EditorState {
        return {
            data: editorStore.getCanvasData(),
            cameraTransform: editorStore.getCanvasTransform()
        };
    }

    componentDidMount() {
        this.setState({ selectedNodeIds: [] });
    }

    shouldComponentUpdate(nextProps: CombinedProps, nextState: EditorState) : boolean {

        if(this.state.selectedNodeIds !== nextState.selectedNodeIds) {
            return false;
        }

        return true;
    }

    private canvasInputFilter = (): boolean => {
        if (d3.event.button === 1) {
            d3.event.preventDefault();
        }

        return d3.event.button === 1 || d3.event.type === "wheel" || (isMac && d3.event.metaKey && d3.event.button === 0)
    }

    private handleNewConnector = (connector: ConnectorData) => {
        if(!this.canConnect(connector)) return;
        editorStore.addConnector(connector);
    }

    private canConnect = (connector: ConnectorData) => {
        const {connectors} = this.state.data;
        const isSameNode = connector.sourceNodeId === connector.toNodeId;
        if(isSameNode) return false;

        const fieldAlreadyConnected = connectors.some(x => x.toNodeId === connector.toNodeId && x.toFieldId === connector.toFieldId);
        if(fieldAlreadyConnected) return false;

        return true;
    }

    private removeConnector = (connector: ConnectorData) => {

        const newState = update(this.state.data, {
            connectors: arr => arr.filter(item => item !== connector)
        });

        editorStore.setCanvasData(newState);
    }

    private removeNode = (nodeId: string) => {
        
        const newState = update(this.state.data, {
            nodes: arr => arr.filter(node => node.id !== nodeId),
            connectors: arr => arr.filter(item => item.sourceNodeId !== nodeId && item.toNodeId !== nodeId)
        });

        editorStore.setCanvasData(newState);
    }

    private handleNodeMoveStop = (nodeId, position) => {

        const index = this.state.data.nodes.findIndex(x => x.id === nodeId);
        const newNodeState = update(this.state.data, {
            nodes: {
                [index]: {
                    position: { $set: position }
                }
            }
        });
        editorStore.setCanvasData(newNodeState);
    }

    private handleConnectorSelect = (connector: ConnectorData, e: React.MouseEvent) => {
    }

    private handleConnectorRightClick = (connector: ConnectorData, e: React.MouseEvent) => {

        if(e.metaKey || e.ctrlKey) {
            this.removeConnector(connector);
            return;
        }

        this.setState({contextData: <ConnectorContextMenu onDeleteConnector={() => this.removeConnector(connector)} />});
    }

    private addNode = (node: NodeData) => {
        editorStore.addNode(node);
    }

    private handleNodeSelect = (nodeId: string, e: React.MouseEvent) => {
        const newState = update(this.state, {
            selectedNodeIds: {
                $push: [nodeId]
            }
        });

        this.setState(newState);
    }

    private handleNodeDeselect = (nodeId: string, e: React.MouseEvent) => {
        const newState = update(this.state, {
            selectedNodeIds: arr => arr.filter(x => x !== nodeId)
        });

        this.setState(newState);
    }

    private handleNodeRightClick = (nodeId: string, e: React.MouseEvent) => {
        this.setState({contextData: (<NodeContextMenu onDeleteNode={() => this.removeNode(nodeId)} />)});
    }

    private handleCanvasRightClick = (e: React.MouseEvent) => {
        this.setState({contextData: <CanvasContextMenu clearCanvas={this.clearCanvas} />});
    }

    private handleContextMenuHide = (e: React.MouseEvent) => {
        this.setState({contextData: undefined});
    }

    private handleCanvasZoomPan = (canvas, transform) => {
        editorStore.setCanvasTransform(transform);
    }

    private clearCanvas = () => {
        editorStore.setCanvasData({ nodes: [], connectors: [] });
    }

    private deleteSelectedNode = () => {
        const { selectedNodeIds } = this.state;
        new Set(selectedNodeIds!).forEach(x => this.removeNode(x));
    }

    public render() {

        const { size, zoomRange } = this.props;
        const { contextData, cameraTransform } = this.state;

        const hotkeyHandler = {
            [EDITOR_KEY_COMMANDS.RESET]: () => this._canvas.reset(),
            [EDITOR_KEY_COMMANDS.DELETE]: () => this.deleteSelectedNode(),
            [EDITOR_KEY_COMMANDS.TEST]: () => {
                const id = this.state.data.nodes.length + 1;
                const newPos = [Math.random() * 900, Math.random() * 900] as XYCoords;
                this.addNode({ id: id.toString(), title: "test " + id, inputs: [{ label: "Input", id: "11" }], outputs: [{label: "Output", id: "2"}], position: newPos })
            }
        }

        const flexStyle : CSSProperties = { flex: 1, flexDirection: "column", display: "flex" };
        const shouldDisplay = !contextData ? "none" : "block";

        return (
            <div className="editor" style={flexStyle}>
                <HotKeys keyMap={EDITOR_KEY_MAP} handlers={hotkeyHandler} style={flexStyle} focused>
                    <ContextMenuTrigger id="canvas_menu" style={flexStyle}>
                        <NodeCanvas ref={(c) => this._canvas = c!} size={size} 
                            pattern={canvasPattern(200)} data={this.state.data}
                            cameraTransform={cameraTransform}
                            fillId="#grid" zoomInputFilter={this.canvasInputFilter} zoomRange={zoomRange} 
                            onNewConnector={this.handleNewConnector} onNodeMoveStop={this.handleNodeMoveStop} 
                            onConnectorSelect={this.handleConnectorSelect} onNodeSelect={this.handleNodeSelect}
                            onNodeDeselect={this.handleNodeDeselect} onNodeRightClick={this.handleNodeRightClick}
                            onConnectorRightClick={this.handleConnectorRightClick} onCanvasRightClick={this.handleCanvasRightClick}
                            onZoomPan={this.handleCanvasZoomPan} />
                    </ContextMenuTrigger>
                </HotKeys>
                <ContextMenu style={{display: shouldDisplay}} id="canvas_menu" onHide={this.handleContextMenuHide}>
                    { !contextData 
                        ? (<MenuItem></MenuItem>) 
                        : contextData
                    }
                </ContextMenu>
            </div>
        )
    }

}

export default Editor;