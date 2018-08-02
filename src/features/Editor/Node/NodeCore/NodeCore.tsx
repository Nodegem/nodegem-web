import React, { PureComponent, CSSProperties } from "react";
import Draggable, { AxisOptions } from "../../Draggable/Draggable";
import classNames from 'classnames';
import { addEvent, removeEvent } from "../../Draggable/utils";
import ReactDOM from "react-dom";
import { nodeMatchesOrWithinParent } from "../../utils";
import { DragData } from "../../Draggable/DraggableCore";

import "./NodeCore.scss";

export type NodeCoreProps = {
    size: [number, number];
    axis?: AxisOptions;
    snapSize?: [number, number];
    handle?: string | null;
    className?: string;
    style?: CSSProperties;
    onFocus?: (node: NodeCore) => void;
    onBlur?: (node: NodeCore) => void;
    onHover?: (node:NodeCore) => void;
    onLeave?: (node: NodeCore) => void;
    onDragStart?: (node: NodeCore, e: MouseEvent, data: DragData) => void | false;
    onDrag?: (node: NodeCore, e: MouseEvent, data: DragData) => void | false;
    onDragStop?: (node: NodeCore, e: MouseEvent, data: DragData) => void | false;
}

export type NodeCoreState = {
    dragging: boolean;
    focused: boolean;
    hovering: boolean;
}

export default class NodeCore extends PureComponent<NodeCoreProps, NodeCoreState> {

    state = {
        dragging: false,
        focused: false,
        hovering: false
    }

    static defaultProps = {
        onFocus: () => {},
        onBlur: () => {},
        onHover: () => {},
        onLeave: () => {},
        onDragStart: () => {},
        onDrag: () => {},
        onDragStop: () => {},
        style: {},
        handle: "",
        axis: "both"
    }

    componentWillUnmount() {
        const thisNode = ReactDOM.findDOMNode(this);
        if(thisNode) {
            const { ownerDocument } = thisNode;
            removeEvent(ownerDocument, "mouseup", this.onOutOfFocus);
        }
    }

    private onEnter = () : void => {
        this.setState({hovering: true});
        this.props.onHover!(this);
    }

    private onLeave = () : void => {
        if(this.state.dragging) return;

        this.setState({hovering: false});
        this.props.onLeave!(this);
    }

    private onMouseDown = (e: MouseEvent) => {

        this.setState({focused: true});
        this.props.onFocus!(this);

        const thisNode = ReactDOM.findDOMNode(this);
        if(thisNode) {
            const {ownerDocument} = thisNode;
            addEvent(ownerDocument, "mousedown", this.onOutOfFocus)
        }
    }

    private onOutOfFocus= (e: MouseEvent) => {
        const thisNode = ReactDOM.findDOMNode(this);
        if(thisNode && e.target) {
            const {ownerDocument} = thisNode;
            if(!nodeMatchesOrWithinParent(thisNode, e.target as Node)) {
                this.setState({focused: false});
                removeEvent(ownerDocument, "mousedown", this.onOutOfFocus);

                this.props.onBlur!(this);
            }
        }
    }

    private onDragStart = (e: MouseEvent, data: DragData) : void | false => {

        const shouldStart = this.props.onDragStart!(this, e, data);
        if(shouldStart === false) return false;

        this.setState({dragging: true});
    }

    private onDrag = (e: MouseEvent, data: DragData) : void | false => {
        const shouldDrag = this.props.onDrag!(this, e, data);
        if(shouldDrag === false) return false;

    }

    private onDragStop = (e: MouseEvent, data: DragData) : void | false => {
        const shouldStop = this.props.onDragStop!(this, e, data);
        if(shouldStop === false) return false;

        this.setState({dragging: false});
    }

    public render() {

        const { size, className, style, handle, snapSize, axis } = this.props;
        const [width, height] = size;
        const { dragging, focused, hovering } = this.state;

        const nodeClasses = classNames({
            "node": true,
            "focused": focused,
            "dragging": dragging,
            "hovering": hovering,
            [className!]: !!className
        });

        return (
            <Draggable onMouseDown={this.onMouseDown} onDrag={this.onDrag} onDragStart={this.onDragStart} 
                onDragStop={this.onDragStop} handle={handle} snapSize={snapSize} axis={axis}>
                <foreignObject width={width} height={height} onMouseEnter={this.onEnter} onMouseLeave={this.onLeave}>
                    <div className={nodeClasses} style={style}>
                        {this.props.children}
                    </div>
                </foreignObject>
            </Draggable>
        )

    }

}