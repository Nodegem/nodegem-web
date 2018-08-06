import React, { PureComponent } from "react";
import { XYCoords } from "../utils/types";
import * as d3 from "d3";
import IOBase from "../Node/IO/IOBase";
import Input from "../Node/IO/Input/Input";
import Output from "../Node/IO/Output/Output";
import ReactDOM from "react-dom";
import { addEvent, removeEvent } from "../Draggable/utils";
import { getPosition } from "../utils";

export type LinkProps = {
    anchor: IOBase | XYCoords;
    drawDefault?: boolean;
    color?: string;
    size?: number;
    curve?: d3.CurveFactory | d3.CurveFactoryLineOnly
}

export type LinkState = {
    drawing: boolean;
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

    public input : Input;
    public output : Output;

    constructor(props : CombinedProps) {
        super(props);

        this.state = {
            drawing: props.drawDefault || true,
            destCoords: [NaN, NaN]
        };
    }

    componentDidMount() {
        const thisNode = ReactDOM.findDOMNode(this);
        if(thisNode) {
            const { ownerDocument } = thisNode;
            addEvent(ownerDocument, "mousemove", this.onDrawing);
            addEvent(ownerDocument, "mousedown", this.onDrawStop);
        }
    }

    componentWillUnmount() {
        this.removeEventHandlers();
    }

    private removeEventHandlers = () : void => {
        const thisNode = ReactDOM.findDOMNode(this);
        if(thisNode) {
            const { ownerDocument } = thisNode;
            removeEvent(ownerDocument, "mousemove", this.onDrawing);
            removeEvent(ownerDocument, "mousedown", this.onDrawStop);
        }
    }

    public placeLink = () : void => {

    }

    private onDrawing = (e: MouseEvent) : void => {

        if(!this.state.drawing) return;

        const position = getPosition(e, ReactDOM.findDOMNode(this) as HTMLElement);   
        this.setState({
            destCoords: position
        });
    }

    private onDrawStop = (e: MouseEvent) : void => {
        this.removeEventHandlers();
    }

    public render() {

        const { size, color, anchor } = this.props;
        const { destCoords } = this.state;

        return (
            <path d={this.lineFunc([anchor as XYCoords, destCoords])!} stroke={color} strokeWidth={size} fill="none" />
        )
    }

}