import React, { PureComponent } from "react";
import DraggableCore, { DraggableCoreProps } from "./DraggableCore";
import { Vector2 } from "./utils/types";

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
}

export default class Draggable extends PureComponent<DraggableProps & DraggableCoreProps, DraggableState> {

    static defaultProps : Partial<DraggableProps> = {
        draggable: false
    }

    handleDragStart = () => {
    }

    handleDrag = () => {
    }

    handleDragStop = () => {
    }

    public render() {
        return (
            <DraggableCore {...this.props} onDrag={this.handleDrag} onDragStart={this.handleDragStart} onDragStop={this.handleDragStop} disabled={false}>
                {React.cloneElement(React.Children.only(this.props.children), {

                })}
            </DraggableCore>
        )
    }

}