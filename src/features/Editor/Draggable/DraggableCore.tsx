import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { addEvent, removeEvent, matchesSelectorAndParentsTo } from "./utils";
import { Vector2 } from "./utils/types";
import { createCoreData } from "./utils/dataUtils";
import { getPosition, snapToGrid } from "./utils/positionUtils";

export type DragData = {
    node: HTMLElement;
    position: Vector2;
    delta: Vector2;
    lastPosition: Vector2;
}

export type MouseData = {
    button: number;
    altKey: boolean;
    metaKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
}

export type DragEventHandler = (e: MouseEvent, data: DragData) => void | false;

export type DraggableCoreProps = {
    handle?: string | null;
    disabled?: boolean;
    snapSize?: [number, number];
    clickFilter?: (mouseInfo: MouseData) => boolean;
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

    static defaultProps = {
        disabled: false,
        onDragStart: () => {},
        onDrag: () => {},
        onDragStop: () => {},
        onMouseDown: () => {},
        onMouseUp: () => {},
        clickFilter: (e: MouseData) => true
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

        if(this.props.disabled ||
            (this.props.handle && !matchesSelectorAndParentsTo(e.target as Node, this.props.handle, thisNode)))
        {
            return;
        }

        const position = getPosition(e, this);
        const {x, y} = position;

        const coreData = createCoreData(this, x, y);

        const shouldUpdate = this.props.onDragStart!(e, coreData);
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
        let {x, y} = position;

        const { snapSize } = this.props;
        if(Array.isArray(snapSize)) {
            let deltaX = x - this.state.lastPosition.x, deltaY = y - this.state.lastPosition.y;
            [deltaX, deltaY] = snapToGrid(snapSize, deltaX, deltaY);
            if (!deltaX && !deltaY) return; // skip useless drag
            x = this.state.lastPosition.x + deltaX, y = this.state.lastPosition.y + deltaY;
        }

        const coreData = createCoreData(this, x, y);

        const shouldUpdate = this.props.onDrag!(e, coreData);
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

        this.props.onDragStop!(e, coreData);

        const thisNode = ReactDOM.findDOMNode(this);
        if(thisNode) {
            const { ownerDocument } = thisNode;
            removeEvent(ownerDocument, dragEventFor.move, this.handleDrag);
            removeEvent(ownerDocument, dragEventFor.stop, this.handleDragStop);
        }
    }

    handleMouseDown = (e: MouseEvent) => {

        const { button, altKey, shiftKey, ctrlKey, metaKey } = e;
        if(!this.props.clickFilter!({button, altKey, shiftKey, ctrlKey, metaKey})) return;

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