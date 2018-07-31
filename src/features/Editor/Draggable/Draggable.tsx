import React, { PureComponent } from "react";
import DraggableCore from "./DraggableCore";

export default class Draggable extends PureComponent {

    handleDragStart = () => {
    }

    handleDrag = () => {
    }

    handleDragStop = () => {
    }

    public render() {
        return (
            <DraggableCore onDrag={this.handleDrag} onDragStart={this.handleDragStart} onDragStop={this.handleDragStop}>
                {React.cloneElement(React.Children.only(this.props.children), {

                })}
            </DraggableCore>
        )
    }

}