import React, { PureComponent } from "react";
import { XYCoords } from "../utils/types";
import * as d3 from "d3";
import ReactDOM from "react-dom";
import { addEvent, removeEvent } from "../Draggable/utils";
import NodeCanvas from "../NodeCanvas/NodeCanvas";
import Socket from "./Socket/Socket";

type LinkEventHandler = (canvasCoords: XYCoords, link: Link) => void | false;

export type LinkProps = {
    canvas: NodeCanvas;
    source: Socket;
    destination: Socket | XYCoords;
    onMouseDown?: LinkEventHandler;
    onDraw?: LinkEventHandler;
    onMouseUp?: LinkEventHandler;
    linkTransform?: (values: XYCoords[]) => XYCoords[];
    drawDefault?: boolean;
    color?: string;
    size?: number;
    curve?: d3.CurveFactory | d3.CurveFactoryLineOnly
}

export type LinkState = {
    drawing: boolean;
    sourceSocket: Socket;
    destinationSocket: Socket | null;
    destPos: XYCoords;
}

type CombinedProps = LinkProps;

export default class Link extends PureComponent<CombinedProps, LinkState> {

    static defaultProps : Partial<LinkProps> = {
        onDraw: () => {},
        onMouseDown: () => {},
        onMouseUp: () => {},
        linkTransform: (values) => values,
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

    public get isConnected() : boolean {
        return false;
    }

    constructor(props : CombinedProps) {
        super(props);

        props.source.setLink(this);

        this.state = {
            drawing: props.drawDefault || true,
            sourceSocket: props.source,
            destinationSocket: null,
            destPos: this.getPosition(props.destination)
        };
    }

    componentDidMount() {
        if(this.state.drawing) {
            this.startDraw();
        }
    }

    componentWillUnmount() {
        this.stopDraw();
    }

    addEvents = () => {
        const thisNode = ReactDOM.findDOMNode(this);
        if(thisNode) {
            const { ownerDocument } = thisNode;
            addEvent(ownerDocument, "mousedown", this.onMouseDown);
            addEvent(ownerDocument, "mousemove", this.onMouseMove);
            addEvent(ownerDocument, "mouseup", this.onMouseUp);
        }
    }

    removeEvents = () => {
        const thisNode = ReactDOM.findDOMNode(this);
        if(thisNode) {
            const {ownerDocument} = thisNode;
            removeEvent(ownerDocument, "mousedown", this.onMouseDown);
            removeEvent(ownerDocument, "mousemove", this.onMouseMove);
            removeEvent(ownerDocument, "mouseup", this.onMouseUp);
        }
    }

    public startDraw = () => {
        this.setState({drawing: true});
        this.addEvents();
    }

    public stopDraw = () => {
        this.setState({drawing: false});
        this.removeEvents();
    }

    public setSourceSocket = (socket: Socket) => {
        socket.setLink(this);
        this.setState({sourceSocket: socket});
    }

    public setDestinationSocket = (socket: Socket) => {
        socket.setLink(this);
        this.setState({destinationSocket: socket});
    }

    private toCanvasCoords = (coords: XYCoords) : XYCoords => {
        return this.props.canvas.toCanvasCoords(coords);
    }

    getConvertedMouseCoords = (e: MouseEvent) : XYCoords => {
        const { clientX, clientY } = e;
        return this.toCanvasCoords([clientX, clientY]);
    }

    private getPosition = (s: Socket | XYCoords) : XYCoords => {
        if(s instanceof Socket) {
            return this.toCanvasCoords(s.center); 
        }
        return this.toCanvasCoords(s as XYCoords);
    }

    onMouseMove = (e: MouseEvent) => {

        if(!this.state.drawing) return;

        const coords = this.getConvertedMouseCoords(e);
        const shouldMove = this.props.onDraw!(coords, this);
        if(shouldMove === false) return;

        this.setState({destPos: coords})
    }

    onMouseUp = (e: MouseEvent) => {
        this.props.onMouseUp!(this.getConvertedMouseCoords(e), this);
    }

    onMouseDown = (e: MouseEvent) => {
        this.props.onMouseDown!(this.getConvertedMouseCoords(e), this);
    }

    public render() {

        const { size, color, linkTransform, source } = this.props;
        const { destPos } = this.state;
        const startPos = this.getPosition(source);

        return (
            <path d={this.lineFunc(linkTransform!([startPos, destPos]))!} stroke={color} strokeWidth={size} fill="none" />
        )
    }

}