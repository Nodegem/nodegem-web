import React, { PureComponent } from "react";
import * as d3 from 'd3';
import { HotKeys } from "react-hotkeys";
import { isMac, convertCommands } from "../../utils";

import "./Editor.scss";
import NodeCanvas from "./NodeCanvas/NodeCanvas";
import { CanvasData, ConnectorData } from "./NodeCanvas/types";
import update from "immutability-helper";
import Spline from "./Spline/Spline";

export type EditorProps = {
    size: [number, number];
    zoomRange: [number, number];
}

type CombinedProps = EditorProps;

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

const nodeData : CanvasData = {
    nodes: {
        "1": { id: "1", title: "goodbye", inputs: [{ label: "Input", id: "10" }, { label: "Input", id: "12" }], outputs: [{label: "Output", id: "1"}], position: [200, 200] },
        "2": { id: "2", title: "hello", inputs: [{ label: "Input", id: "11" }, { label: "Input", id: "12" }, { label: "Input", id: "13" }], outputs: [{label: "Output", id: "2"}], position: [400, 550] },
        "3": { id: "3", title: "test", inputs: [{ label: "Input", id: "11" }], outputs: [{label: "Output", id: "2"}], position: [800, 550] },
        "4": { id: "4", title: "test 2", inputs: [{ label: "Input", id: "11" }], outputs: [{label: "Output", id: "2"}], position: [600, 300] },
    },
    connectors: [
        { sourceNodeId: "1", sourceFieldId: "1", toNodeId: "2", toFieldId: "13" },
        { sourceNodeId: "2", sourceFieldId: "2", toNodeId: "3", toFieldId: "11" }
    ]
}

type EditorState = {
    data: CanvasData;
}

class Editor extends PureComponent<CombinedProps, EditorState> {

    private _canvas: NodeCanvas;

    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            data: nodeData
        };
    }

    componentDidMount() {
        document.oncontextmenu = (e) => false;
    }

    private canvasInputFilter = (): boolean => {
        if (d3.event.button === 1) {
            d3.event.preventDefault();
        }

        return d3.event.button === 1 || d3.event.type === "wheel" || (isMac && d3.event.metaKey && d3.event.button === 0)
    }

    private handleNewConnector = (connector: ConnectorData) => {
        const newState = update(this.state.data, {
            connectors: {
                $push: [connector]
            }
        });

        this.setState({data: newState});
    }

    private handleNodeMoveStop = (nodeId, position) => {

        const newNodeState = update(this.state.data, {
            nodes: {
                [nodeId]: {
                    position: {
                        $set: position
                    }
                }
            }
        });

        this.setState({
            data: newNodeState
        });
    }

    private handleConnectorSelect = (connector: ConnectorData, e: React.MouseEvent) => {
        console.log("Connector Selected", e.button);
    }

    private handleNodeDeselect = (nodeId: string, e: React.MouseEvent) => {
        console.log("Node Deselected ", nodeId, e.button);
    }

    public render() {

        const { size, zoomRange } = this.props;

        const hotkeyHandler = {
            [EDITOR_KEY_COMMANDS.RESET]: () => this._canvas.reset()
        }

        return (
            <HotKeys keyMap={convertCommands(EDITOR_KEY_MAP)} handlers={hotkeyHandler} style={{ flex: 1, flexDirection: "column", display: "flex" }} focused>
                <NodeCanvas ref={(c) => this._canvas = c!} size={size} pattern={canvasPattern(200)} data={this.state.data}
                    fillId="#grid" zoomInputFilter={this.canvasInputFilter} zoomRange={zoomRange} 
                    onNewConnector={this.handleNewConnector} onNodeMoveStop={this.handleNodeMoveStop} onConnectorSelect={this.handleConnectorSelect}
                    onNodeDeselect={this.handleNodeDeselect} />
            </HotKeys>
        )
    }

}

export default Editor;