import React, { PureComponent, CSSProperties, Props } from "react";
import * as d3 from 'd3';
import { HotKeys } from "react-hotkeys";
import { isMac, convertCommands } from "../../utils";
import { ContextMenuTrigger, ContextMenu, MenuItem } from 'react-contextmenu';
import NodeCanvas from "./NodeCanvas/NodeCanvas";
import { CanvasData, ConnectorData } from "./NodeCanvas/types";
import update from "immutability-helper";

import "./Editor.scss";
import "./ContextMenu/context-menu.scss";
import { ComponentBase } from "resub";
import { editorStore } from "../../stores/EditorStore";

enum EDITOR_KEY_COMMANDS {
    RESET = "RESET",
    FULLSCREEN = "FULLSCREEN"
}

const EDITOR_KEY_MAP = {
    [EDITOR_KEY_COMMANDS.RESET]: "space",
    [EDITOR_KEY_COMMANDS.FULLSCREEN]: "ctrl+shift+space"
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
)

const NodeContextMenu = (data) => {
    return (
        <MenuItem>Node</MenuItem>
    )
}

const ConnectorContextMenu = (data) => {
    return (
        <MenuItem>Connector</MenuItem>
    )
}

const CanvasContextMenu = (data) => {
    return (
        <MenuItem>Canvas</MenuItem>
    )
}

export type EditorProps = {
    size: [number, number];
    zoomRange: [number, number];
}

type CombinedProps = EditorProps & Props<any>;

type EditorState = {
    data: CanvasData;
    cameraTransform?: [number, number, number];
    contextData?: JSX.Element;
}

class Editor extends ComponentBase<CombinedProps, EditorState> {

    private _canvas: NodeCanvas;

    protected _buildState(props: CombinedProps) : EditorState {
        return {
            data: editorStore.getCanvasData(),
            cameraTransform: editorStore.getCanvasTransform()
        };
    }

    private canvasInputFilter = (): boolean => {
        if (d3.event.button === 1) {
            d3.event.preventDefault();
        }

        return d3.event.button === 1 || d3.event.type === "wheel" || (isMac && d3.event.metaKey && d3.event.button === 0)
    }

    private handleNewConnector = (connector: ConnectorData) => {

        if(!this.canConnect(connector)) return;

        const newState = update(this.state.data, {
            connectors: {
                $push: [connector]
            }
        });

        editorStore.setCanvasData(newState);
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

        this.setState({contextData: ConnectorContextMenu(connector)});
    }

    private handleNodeDeselect = (nodeId: string, e: React.MouseEvent) => {
    }

    private handleNodeRightClick = (nodeId: string, e: React.MouseEvent) => {

        if(e.metaKey || e.ctrlKey) {
            this.removeNode(nodeId);
            return;
        }

        this.setState({contextData: NodeContextMenu(nodeId)});
    }

    private handleCanvasRightClick = (e: React.MouseEvent) => {
        this.setState({contextData: CanvasContextMenu({})});
    }

    private handleContextMenuHide = (e: React.MouseEvent) => {
        this.setState({contextData: undefined});
    }

    private handleCanvasZoomPan = (canvas, transform) => {
        editorStore.setCanvasTransform(transform);
    }

    public render() {

        const { size, zoomRange } = this.props;
        const { contextData, cameraTransform } = this.state;

        const hotkeyHandler = {
            [EDITOR_KEY_COMMANDS.RESET]: () => this._canvas.reset()
        }

        const flexStyle : CSSProperties = { flex: 1, flexDirection: "column", display: "flex" };
        const shouldDisplay = !contextData ? "none" : "block";

        return (
            <div className="editor" style={flexStyle}>
                <HotKeys keyMap={convertCommands(EDITOR_KEY_MAP)} handlers={hotkeyHandler} style={flexStyle} focused>
                    <ContextMenuTrigger id="canvas_menu" style={flexStyle}>
                        <NodeCanvas ref={(c) => this._canvas = c!} size={size} 
                            pattern={canvasPattern(200)} data={this.state.data}
                            cameraTransform={cameraTransform}
                            fillId="#grid" zoomInputFilter={this.canvasInputFilter} zoomRange={zoomRange} 
                            onNewConnector={this.handleNewConnector} onNodeMoveStop={this.handleNodeMoveStop} onConnectorSelect={this.handleConnectorSelect}
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