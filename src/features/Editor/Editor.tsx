import React, { PureComponent } from "react";
import * as d3 from 'd3';

import "./Editor.scss";
import { withFauxDOM, ReactFauxDomProps } from "react-faux-dom";
import { ZoomTransform, ZoomBehavior } from "d3";
import { HotKeys } from "react-hotkeys";

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

class Editor extends PureComponent<CombinedProps, EditorState> {

    state = {
        nodes: []
    }

    private zoom: ZoomBehavior<Element, {}>;

    get halfWidth() : number {
        return this.props.size[0] / 2;
    }

    get halfHeight() : number {
        return this.props.size[1] / 2;
    }

    constructor(props: CombinedProps) {
        super(props);

        this.handleCanvasZoom = this.handleCanvasZoom.bind(this);
        this.setZoom = this.setZoom.bind(this);
    }
    
    componentDidMount() {

        const { zoomRange } = this.props;

        this.zoom = d3.zoom()
            .scaleExtent(zoomRange)
            .translateExtent([[-this.halfWidth, -this.halfHeight], [this.halfWidth, this.halfHeight]])
            .filter(() => d3.event.button === 1 || d3.event.type === "wheel")
            .on("zoom", this.handleCanvasZoom);

        d3.select("#canvasGrid")
            .call(this.zoom);

    }
    
    private handleCanvasZoom() {
        this.setZoom(d3.event.transform);
    }

    private setZoom(transform: any) {
        d3.select("#view")
            .attr("transform", transform); 
    }

    public render() {

        const { size, gridSpacing, dotSize } = this.props;
        const [ width, height ] = size;
        const [ halfWidth, halfHeight ] = [width / 2, height / 2];

        const hotkeyHandler = {

        }

        return (
            <svg className="editor" id="canvasGrid">
                <defs>
                    <pattern id="pattern" width={gridSpacing} height={gridSpacing} patternUnits="userSpaceOnUse">
                        <circle cx={gridSpacing / 2} cy={gridSpacing / 2} r={dotSize} fill="lightgray" />
                    </pattern>
                </defs>

                <g id="view">
                    <rect x={-halfWidth} y={-halfHeight} width={width} height={height} className="editor-background" />
                </g>
            </svg>
        )
    }

}

export default withFauxDOM(Editor);