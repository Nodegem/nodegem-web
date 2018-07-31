import React, { PureComponent } from "react";
import * as d3 from 'd3';

import "./Editor.scss";
import { withFauxDOM, ReactFauxDomProps } from "react-faux-dom";
import { ZoomTransform, ZoomBehavior } from "d3";
import { HotKeys } from "react-hotkeys";
import { isInput, isMac } from "../../utils";
import Node from './Node/Node';
import Draggable from "./Draggable/Draggable";

export interface EditorProps {
    size: [number, number];
    zoomRange: [number, number];
    gridSpacing: number;
    dotSize: number;
}

export interface EditorState {
    nodes: {}[];
}

type CombinedProps = EditorProps & ReactFauxDomProps;

enum EDITOR_KEY_COMMANDS {
    RESET = "RESET",
}

const EDITOR_KEY_MAP = {
    [EDITOR_KEY_COMMANDS.RESET]: "space"
}

class Editor extends PureComponent<CombinedProps, EditorState> {

    state = {
        nodes: []
    }

    private zoom: ZoomBehavior<Element, {}>;

    get halfWidth(): number {
        return this.props.size[0] / 2;
    }

    get halfHeight(): number {
        return this.props.size[1] / 2;
    }

    constructor(props: CombinedProps) {
        super(props);

        this.handleCanvasZoom = this.handleCanvasZoom.bind(this);
        this.resetZoom = this.resetZoom.bind(this);
        this.setZoom = this.setZoom.bind(this);
    }

    componentDidMount() {

        const { zoomRange } = this.props;

        this.zoom = d3.zoom()
            .scaleExtent(zoomRange)
            .translateExtent([[-this.halfWidth, -this.halfHeight], [this.halfWidth, this.halfHeight]])
            .filter(this.inputFilter)
            .on("zoom", this.handleCanvasZoom);

        d3.select("#canvasGrid")
            .call(this.zoom);

    }

    private inputFilter() : boolean {
        return d3.event.button === 1 || d3.event.type === "wheel" || (isMac && d3.event.metaKey && d3.event.button === 0)
    }

    private handleCanvasZoom() {
        this.setZoom(d3.event.transform);
    }

    private setZoom(transform: any) {
        d3.select("#view")
            .attr("transform", transform);
    }

    private resetZoom(event: KeyboardEvent) {
        if (!isInput(event.target as Element)) {
            d3.select("#canvasGrid")
                .transition()
                .duration(500)
                .call(this.zoom.transform as any, d3.zoomIdentity);
        }
    }

    private setCameraTransform(transform: ZoomTransform) {
        d3.select("#canvasGrid")
            .call(this.zoom.transform, d3.zoomIdentity.translate(transform.x, transform.y).scale(transform.k));
    }

    public render() {

        const { size, gridSpacing, dotSize } = this.props;
        const [width, height] = size;
        const [halfWidth, halfHeight] = [width / 2, height / 2];

        const hotkeyHandler = {
            [EDITOR_KEY_COMMANDS.RESET]: this.resetZoom
        }

        return (
            <HotKeys keyMap={EDITOR_KEY_MAP} handlers={hotkeyHandler} style={{ flex: 1, flexDirection: "column" }} focused>
                <svg className="editor" id="canvasGrid">
                    <defs>
                        {/* <pattern id="pattern" width={gridSpacing} height={gridSpacing} patternUnits="userSpaceOnUse">
                            <circle cx={gridSpacing / 2} cy={gridSpacing / 2} r={dotSize} fill="lightgray" />
                        </pattern> */}
                        <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="lightgray" strokeWidth="0.5" />
                        </pattern>
                        <pattern id="grid" width="200" height="200" patternUnits="userSpaceOnUse">
                            <rect width="200" height="200" fill="url(#smallGrid)" />
                            <path d="M 200 0 L 0 0 0 200" fill="none" stroke="gray" strokeWidth=".5" />
                        </pattern>
                    </defs>

                    <g id="view">
                        <rect x={-halfWidth} y={-halfHeight} width={width} height={height} className="editor-background" />
                        <g id="nodeContainer" onDrag={() => console.log("sda")}>
                            <Node size={{x: 200, y: 200}} />
                        </g>
                    </g>
                </svg>
            </HotKeys>
        )
    }

}

export default withFauxDOM(Editor);