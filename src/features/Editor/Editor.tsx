import React, { PureComponent } from "react";
import * as d3 from 'd3';

import "./Editor.scss";
import { ZoomTransform, ZoomBehavior, BaseType } from "d3";
import { HotKeys } from "react-hotkeys";
import { isInput, isMac, convertCommands } from "../../utils";
import Node from './Node/Node';
import Draggable from "./Draggable/Draggable";
import Canvas, { CanvasProps } from "./Canvas/Canvas";

export type EditorProps = {
    size: [number, number];
    zoomRange: [number, number];
    gridSpacing: number;
    dotSize: number;
}

export type EditorState = {
    nodes: {}[];
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

const canvasPattern = (
    <g>
        <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="lightgray" strokeWidth="0.5" />
        </pattern>
        <pattern id="grid" width="200" height="200" patternUnits="userSpaceOnUse">
            <rect width="200" height="200" fill="url(#smallGrid)" />
            <path d="M 200 0 L 0 0 0 200" fill="none" stroke="gray" strokeWidth=".5" />
        </pattern>
    </g>
)

class Editor extends PureComponent<CombinedProps, EditorState> {

    state = {
        nodes: [],
    }

    private _canvas: Canvas;

    private canvasInputFilter = (ev: any): boolean => {
        if (d3.event.button === 1) {
            d3.event.preventDefault();
        }

        return d3.event.button === 1 || d3.event.type === "wheel" || (isMac && d3.event.metaKey && d3.event.button === 0)
    }

    public render() {

        const { size } = this.props;

        const hotkeyHandler = {
            [EDITOR_KEY_COMMANDS.RESET]: () => this._canvas.reset()
        }

        return (
            <HotKeys keyMap={convertCommands(EDITOR_KEY_MAP)} handlers={hotkeyHandler} style={{ flex: 1, flexDirection: "column" }} focused>
                <Canvas ref={(c) => this._canvas = c!} size={size} pattern={canvasPattern} fillId="#grid" zoomInputFilter={this.canvasInputFilter} zoomRange={[.5, 1.5]}>
                    <g id="node-container">
                        <Node size={[200, 200]} />
                    </g>
                </Canvas>
            </HotKeys>
        )
    }

}

export default Editor;