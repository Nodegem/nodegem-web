import React, { PureComponent, EventHandler } from "react";
import ReactDOM from "react-dom";
import { addEvent, removeEvent } from "./utils";
import { Vector2 } from "./utils/types";
import { createCoreData } from "./utils/dataUtils";
import { getPosition } from "./utils/positionUtils";

export type DragData = {
    node: HTMLElement;
    position: Vector2;
    delta: Vector2;
    lastPosition: Vector2;
}

export type DragEventHandler = (e: MouseEvent, data: DragData) => void | false;

export type DraggableCoreProps = {
    disabled?: boolean;
    onMouseDown?: (event: MouseEvent) => void;
    onMouseUp?: (event: MouseEvent) => void;
    onDragStart?: DragEventHandler;
    onDrag?: DragEventHandler;
    onDragStop?: DragEventHandler;
}

export type DraggableCoreState = {
    lastPosition: Vector2;
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
        disabled: false,
        onDragStart: () => {},
        onDrag: () => {},
        onDragStop: () => {},
        onMouseDown: () => {},
        onMouseUp: () => {}
    }

    constructor(props: DraggableCoreProps) {
        super(props);

        this.state = {
            lastPosition: {x: NaN, y: NaN},
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

        if(this.props.disabled) {
            return;
        }

        const position = getPosition(e, this);
        const {x, y} = position;

        const coreData = createCoreData(this, x, y);

        let shouldUpdate;
        if(this.props.onDragStart) {
            shouldUpdate = this.props.onDragStart(e, coreData);
        }

        if(shouldUpdate === false) return;

        this.setState({
            dragging: true,
            lastPosition: {
                x: x,
                y: y
            }
        })

        const { ownerDocument } = thisNode;
        addEvent(ownerDocument, dragEventFor.move, this.handleDrag);
        addEvent(ownerDocument, dragEventFor.stop, this.handleDragStop);
    }

    handleDrag = (e: MouseEvent) => {

        const position = getPosition(e, this);
        const {x, y} = position;

        const coreData = createCoreData(this, x, y);

        let shouldUpdate;
        if(this.props.onDrag) {
            shouldUpdate = this.props.onDrag(e, coreData);
        }

        if(shouldUpdate === false) {
            this.handleDragStop(new MouseEvent('mouseup'));
            return;
        }

        this.setState({
            lastPosition: {
                x: x,
                y: y
            }
        })
    }

    handleDragStop = (e: MouseEvent) => {

        if(!this.state.dragging) return;

        const position = getPosition(e, this);
        const {x, y} = position;

        const coreData = createCoreData(this, x, y);

        this.setState({
            dragging: false,
            lastPosition: {
                x: NaN,
                y: NaN
            }
        });

        if(this.props.onDragStop) {
            this.props.onDragStop(e, coreData);
        }

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