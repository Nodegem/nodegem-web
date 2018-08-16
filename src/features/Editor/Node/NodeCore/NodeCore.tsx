import React, { PureComponent, CSSProperties } from "react";
import Draggable, { AxisOptions } from "../../Draggable/Draggable";
import classNames from 'classnames';
import { DragData } from "../../Draggable/DraggableCore";
import { XYCoords } from "../../utils/types";
import onClickOutside, { InjectedOnClickOutProps, HandleClickOutside } from "react-onclickoutside";

import "./NodeCore.scss";

type EventHandler = (e: React.MouseEvent, node: NodeCore) => void;
type DragEventHandler = (e: React.MouseEvent, data: DragData, node: NodeCore) => void | false;

export type NodeCoreProps = {
    size: [number, number];
    position?: XYCoords;
    axis?: AxisOptions;
    snapSize?: [number, number];
    handle?: string | null;
    className?: string;
    style?: CSSProperties;
}

export type NodeCoreEventHandlers = {
    onDoubleClick?: EventHandler;
    onFocus?: EventHandler;
    onBlur?: EventHandler;
    onHover?: EventHandler;
    onLeave?: EventHandler;
    onDragStart?: DragEventHandler;
    onDrag?: DragEventHandler;
    onDragStop?: DragEventHandler;
}

export type NodeCoreState = {
    dragging: boolean;
    focused: boolean;
    hovering: boolean;
}

type CombineProps = NodeCoreProps & NodeCoreEventHandlers & InjectedOnClickOutProps;

class NodeCore extends PureComponent<CombineProps, NodeCoreState> implements HandleClickOutside<any> {

    state = {
        dragging: false,
        focused: false,
        hovering: false
    }

    static defaultProps : Partial<NodeCoreProps & NodeCoreEventHandlers> = {
        onDoubleClick: () => {},
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

    private _draggable : Draggable;

    get position() : XYCoords {
        const { x, y } = this._draggable.position;
        return [x, y];
    }

    private onEnter = (e: React.MouseEvent) : void => {
        this.setState({hovering: true});
        this.props.onHover!(e, this);
    }

    private onLeave = (e: React.MouseEvent) : void => {
        if(this.state.dragging) return;

        this.setState({hovering: false});
        this.props.onLeave!(e, this);
    }

    private onMouseDown = (e: React.MouseEvent) => {
        this.setState({focused: true});
        this.props.onFocus!(e, this);
    }

    handleClickOutside = (e: React.MouseEvent) : void => {
        if(this.state.focused) {
            this.props.onBlur!(e, this);
        }

        this.setState({focused: false});
    }

    private handleDoubleClick = (e: React.MouseEvent) : void => {
        this.props.onDoubleClick!(e, this);
    }

    private onDragStart = (e: React.MouseEvent, data: DragData) : void | false => {

        const shouldStart = this.props.onDragStart!(e, data, this);
        if(shouldStart === false) return false;

        this.setState({dragging: true});
    }

    private onDrag = (e: React.MouseEvent, data: DragData) : void | false => {
        const shouldDrag = this.props.onDrag!(e, data, this);
        if(shouldDrag === false) return false;

    }

    private onDragStop = (e: React.MouseEvent, data: DragData) : void | false => {
        const shouldStop = this.props.onDragStop!(e, data, this);
        if(shouldStop === false) return false;

        this.setState({dragging: false});
    }

    public render() {

        const { size, className, style, handle, snapSize, axis, position } = this.props;
        const [width, height] = size;
        const { dragging, focused, hovering } = this.state;

        const nodeClasses = classNames({
            "node": true,
            "focused": focused,
            "dragging": dragging,
            "hovering": hovering,
            [className!]: !!className
        });

        //TODO: find some hack that doesn't require me to specify a height and width
        return (
            <Draggable ref={(d) => this._draggable = d!} position={position && {x: position[0], y: position[1]}} 
                onMouseDown={this.onMouseDown} onDrag={this.onDrag} onDragStart={this.onDragStart} 
                onDragStop={this.onDragStop} handle={handle} snapSize={snapSize} axis={axis}>
                <foreignObject width={width} height={height} style={{overflow: "visible"}} onMouseEnter={this.onEnter} onMouseLeave={this.onLeave}>
                    <div className={nodeClasses} style={style} onDoubleClick={this.handleDoubleClick}>
                        {this.props.children}
                    </div>
                </foreignObject>
            </Draggable>
        )

    }

}

export default onClickOutside(NodeCore);