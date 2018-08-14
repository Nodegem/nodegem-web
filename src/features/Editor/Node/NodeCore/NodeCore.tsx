import React, { PureComponent, CSSProperties } from "react";
import Draggable, { AxisOptions } from "../../Draggable/Draggable";
import classNames from 'classnames';
import { DragData } from "../../Draggable/DraggableCore";
import { XYCoords } from "../../utils/types";

import "./NodeCore.scss";
import onClickOutside, { InjectedOnClickOutProps, HandleClickOutside } from "react-onclickoutside";

export type NodeCoreProps = {
    size: [number, number];
    position?: XYCoords;
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

type CombineProps = NodeCoreProps & InjectedOnClickOutProps;

class NodeCore extends PureComponent<CombineProps, NodeCoreState> implements HandleClickOutside<any> {

    state = {
        dragging: false,
        focused: false,
        hovering: false
    }

    static defaultProps : Partial<NodeCoreProps> = {
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
    }

    handleClickOutside = (event: React.MouseEvent<any>) : void => {
        this.setState({focused: false});
        this.props.onBlur!(this);
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
            <Draggable ref={(d) => this._draggable = d!} position={position && {x: position[0], y: position[1]}} onMouseDown={this.onMouseDown} onDrag={this.onDrag} onDragStart={this.onDragStart} 
                onDragStop={this.onDragStop} handle={handle} snapSize={snapSize} axis={axis}>
                <foreignObject width={width} height={height} style={{overflow: "visible"}} onMouseEnter={this.onEnter} onMouseLeave={this.onLeave}>
                    <div className={nodeClasses} style={style}>
                        {this.props.children}
                    </div>
                </foreignObject>
            </Draggable>
        )

    }

}

export default onClickOutside(NodeCore);