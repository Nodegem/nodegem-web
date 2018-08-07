import React, { PureComponent } from "react";
import { XYCoords } from "../utils/types";
import * as d3 from "d3";
import IOBase from "../Node/IO/IOBase";
import Input from "../Node/IO/Input/Input";
import Output from "../Node/IO/Output/Output";
import ReactDOM from "react-dom";
import { addEvent, removeEvent } from "../Draggable/utils";
import NodeCanvas from "../NodeCanvas/NodeCanvas";

export type LinkProps = {
    canvas: NodeCanvas;
    startPos: XYCoords;
    destPos: XYCoords;
    drawDefault?: boolean;
    color?: string;
    size?: number;
    curve?: d3.CurveFactory | d3.CurveFactoryLineOnly
}

export type LinkState = {
    drawing: boolean;
    startPos: XYCoords;
    destPos: XYCoords;
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

    public input : Input;
    public output : Output;

    constructor(props : CombinedProps) {
        super(props);

        this.state = {
            drawing: props.drawDefault || true,
            startPos: this.getCoords(props.startPos),
            destPos: this.getCoords(props.destPos)
        };
    }

    componentDidMount() {
        const thisNode = ReactDOM.findDOMNode(this);
        if(thisNode) {
            const { ownerDocument } = thisNode;
            addEvent(ownerDocument, "mousemove", this.onDraw)
        }
    }

    private getCoords = (coords: XYCoords) : XYCoords => {
        return this.props.canvas.convertCoords(coords);
    }

    onDraw = (e: MouseEvent) => {

        const { clientX, clientY } = e;

        this.setState({destPos: this.getCoords([clientX, clientY])})
    }

    public render() {

        const { size, color } = this.props;
        const { destPos, startPos } = this.state;

        return (
            <path d={this.lineFunc([startPos, destPos])!} stroke={color} strokeWidth={size} fill="none" />
        )
    }

}