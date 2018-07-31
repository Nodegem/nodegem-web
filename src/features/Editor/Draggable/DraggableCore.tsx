import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { addEvent, removeEvent } from "./utils";

export type DragData = {
    node: HTMLElement;
    position: Vector2;
    delta: Vector2;
    lastPosition: Vector2;
}

export type DragEventHandler = (e: MouseEvent, data: DragData | null) => void;

export type DraggableCoreProps = {
    onMouseDown?: (event: MouseEvent) => void;
    onMouseUp?: (event: MouseEvent) => void;
    onDragStart: DragEventHandler;
    onDrag: DragEventHandler;
    onDragStop: DragEventHandler;
}

export type DraggableCoreState = {
    coords: Vector2;
    dragging: boolean;
}

const events = {
    mouse: {
        start: "mousedown",
        move: "mousemove",
        stop: "mouseup"
    }
}

let dragEventFor = events.mouse;

export default class DraggableCore extends PureComponent<DraggableCoreProps, DraggableCoreState> {

    static defaultProps : DraggableCoreProps = {
        onDragStart: () => {},
        onDrag: () => {},
        onDragStop: () => {},
        onMouseDown: () => {},
        onMouseUp: () => {}
    }

    constructor(props: DraggableCoreProps) {
        super(props);

        this.state = {
            coords: {x: NaN, y: NaN},
            dragging: false
        }
    }

    componentWillUnmount() {

        const thisNode = ReactDOM.findDOMNode(this);

        if(thisNode) {
            const { ownerDocument } = thisNode;
            removeEvent(ownerDocument, dragEventFor.move, this.handleDrag);
            removeEvent(ownerDocument, dragEventFor.stop, this.handleDragStop);
        }

    }

    handleDragStart = (e: MouseEvent) => {

        const thisNode = ReactDOM.findDOMNode(this);
        if(!thisNode || !thisNode.ownerDocument || !thisNode.ownerDocument.body) {
            return;
        }

        this.props.onDragStart(e, null);

        this.setState({
            dragging: true,
            coords: {
                x: 0,
                y: 0
            }
        })

        const { ownerDocument } = thisNode;
        addEvent(ownerDocument, dragEventFor.move, this.handleDrag);
        addEvent(ownerDocument, dragEventFor.stop, this.handleDragStop);
    }

    handleDrag = (e: MouseEvent) => {
        this.props.onDrag(e, null);

        this.setState({
            coords: {
                x: 0,
                y: 0
            }
        })
    }

    handleDragStop = (e: MouseEvent) => {

        if(!this.state.dragging) return;

        this.setState({
            dragging: false,
            coords: {
                x: NaN,
                y: NaN
            }
        });

        this.props.onDragStop(e, null);

        const thisNode = ReactDOM.findDOMNode(this);
        if(thisNode) {
            const { ownerDocument } = thisNode;
            removeEvent(ownerDocument, dragEventFor.move, this.handleDrag);
            removeEvent(ownerDocument, dragEventFor.stop, this.handleDragStop);
        }
    }

    handleMouseDown = (e: MouseEvent) => {

        if(this.props.onMouseDown) {
            this.props.onMouseDown(e);
        }

        this.handleDragStart(e);
    }

    handleMouseUp = (e: MouseEvent) => {

        if(this.props.onMouseUp) {
            this.props.onMouseUp(e);
        }

        this.handleDragStop(e);
    }

    public render() {

        let { children } = this.props;

        return (
            React.cloneElement(React.Children.only(children), {
                onMouseDown: this.handleMouseDown,
                onMouseUp: this.handleMouseUp
            })
        )
    }

}