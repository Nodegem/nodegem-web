import React, { PureComponent } from "react";
import DraggableCore, { DraggableCoreProps, DragEventHandler, DragData } from "./DraggableCore";
import { Vector2, EventHandler } from "./utils/types";
import ReactDOM from "react-dom";
import { createSVGTransform } from "./utils/positionUtils";
import { createDragData } from "./utils/dataUtils";
import { findParentWithTransform, parseTransform } from "./utils";

export type AxisOptions = 'both' | 'x' | 'y' | 'none';

export type DraggableProps = {
    draggable?: boolean;
    position?: Vector2;
    defaultPosition?: Vector2;
    axis?: AxisOptions;
}

export type DraggableState = {
    dragging: boolean;
    position: Vector2;
    isElementSVG: boolean;
    containerSVG: SVGElement | false;
}

export default class Draggable extends PureComponent<DraggableProps & DraggableCoreProps, DraggableState> {

    static defaultProps = {
        snapToGrid: false,
        draggable: true,
        axis: "both",
        defaultPosition: {x: 0, y: 0},
        ...DraggableCore.defaultProps
    }

    get scale() : number {
        const { containerSVG } = this.state;
        if(containerSVG === false) return 1;
        const transform = containerSVG.getAttribute("transform");
        return parseTransform(transform).scale[0];
    }

    get position() : Vector2 {
        return this.state.position;
    }

    constructor(props : DraggableProps & DraggableCoreProps) {
        super(props);

        this.state = {
            dragging: false,
            position: this.props.position! || this.props.defaultPosition,
            isElementSVG: false,
            containerSVG: false
        }
    }

    componentDidMount() {

        const isSvg = ReactDOM.findDOMNode(this) instanceof SVGElement;

        if(isSvg) {
            const container = findParentWithTransform(this);
            this.setState({containerSVG: container});
        }

        this.setState({
            isElementSVG: isSvg
        })
    }

    componentWillUnmount() {
        this.setState({dragging: false});
    }

    handleDragStart = (e: React.MouseEvent, data: DragData) : false | void => {

        if(!this.props.draggable) return false;

        const shouldStart = this.props.onDragStart!(e, createDragData(this, data));
        if(shouldStart === false) return false;

        this.setState({dragging: true});
    }

    handleDrag = (e: React.MouseEvent, data: DragData) : false | void => {

        if(!this.state.dragging) return false;

        const dragData = createDragData(this, data);

        const newState = {
            position: dragData.position
        };

        const shouldDrag = this.props.onDrag!(e, dragData);
        if(shouldDrag === false) return false;

        this.setState(newState);
    }

    handleDragStop = (e: React.MouseEvent, data: DragData) : false | void => {

        if(!this.state.dragging) return false;

        const shouldStop = this.props.onDragStop!(e, createDragData(this, data));
        if(shouldStop === false) return false;

        this.setState({dragging: false});
    }

    private canDragX = () : boolean => {
        return this.props.draggable && this.props.axis === "both" || this.props.axis === "x";
    }

    private canDragY = () : boolean => {
        return this.props.draggable && this.props.axis === "both" || this.props.axis === "y";
    }

    public render() {

        const { isElementSVG } = this.state;
        const { position, defaultPosition } = this.props;

        const currentPosition = position! || defaultPosition!;
        const transformOpts = {
            x: this.canDragX()
                ? this.state.position.x
                : currentPosition!.x || 0,
            y: this.canDragY()
                ? this.state.position.y
                : currentPosition!.y || 0
        };

        const svgTransform: string = isElementSVG ? createSVGTransform(transformOpts) : "";

        return (
            <DraggableCore {...this.props} onDrag={this.handleDrag} onDragStart={this.handleDragStart} onDragStop={this.handleDragStop} disabled={false}>
                {React.cloneElement(React.Children.only(this.props.children), {
                    transform: svgTransform
                })}
            </DraggableCore>
        )
    }

}