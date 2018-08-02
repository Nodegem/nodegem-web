import React, { PureComponent } from "react";
import Draggable from "../../Draggable/Draggable";
import classNames from 'classnames';

export type NodeShellProps = {
    size: [number, number];
}

export type NodeShellState = {
    dragging: boolean;
    focused: boolean;
    hovering: boolean;
}

export default class NodeShell extends PureComponent<NodeShellProps, NodeShellState> {

    state = {
        dragging: false,
        focused: false,
        hovering: false
    }

    public render() {

        const { size, ...rest } = this.props;
        const [width, height] = size;
        const { dragging, focused, hovering } = this.state;

        const nodeClasses = classNames({
            "node": true,
            "focused": focused,
            "dragging": dragging,
            "hovering": hovering
        });

        return (
            <Draggable>
                <foreignObject width={width} height={height} {...rest}>
                    <div className={nodeClasses}>
                        {this.props.children}
                    </div>
                </foreignObject>
            </Draggable>
        )

    }

}