import React, { PureComponent } from "react";
import { XYCoords } from "../utils/types";
import { ReactFauxDomProps, withFauxDOM } from "react-faux-dom";
import * as d3 from "d3";
import Draggable from "../Draggable/Draggable";
import { DragData } from "../Draggable/DraggableCore";

export type LinkProps = {
    color?: string;
    size?: number;
    curve?: d3.CurveFactory | d3.CurveFactoryLineOnly
}

export type LinkState = {
    drawing: boolean;
    sourceCoords: XYCoords;
    destCoords: XYCoords;
}

type CombinedProps = LinkProps;

export default class Link extends PureComponent<CombinedProps, LinkState> {

    static defaultProps : Partial<LinkProps> = {
        color: "black",
        size: 2,
        curve: d3.curveLinear
    }

    private get lineFunc() : d3.Line<XYCoords> {
        const { curve } = this.props;
        return d3.line()
            .x((d) => d[0])
            .y((d) => d[1])
            .curve(curve!);
    }

    constructor(props : CombinedProps) {
        super(props);

        this.state = {
            drawing: false,
            sourceCoords: [0, 0],
            destCoords: [0, 0]
        };
    }

    private onDragStart = (e: MouseEvent, data: DragData) : void | false => {
    }

    private onDrag = (e: MouseEvent, data: DragData) => {
    }

    private onDragStop = (e: MouseEvent, data: DragData) => {
    }

    public render() {

        const { size, color } = this.props;

        return (
            <Draggable onDragStart={this.onDragStart} onDrag={this.onDrag} onDragStop={this.onDragStop}>
                <g>
                    <path d={this.lineFunc([[0, 0], [400, 400], [400, 200]])!} stroke={color} strokeWidth={size} fill="none" />
                </g>
            </Draggable>
        )
    }

}