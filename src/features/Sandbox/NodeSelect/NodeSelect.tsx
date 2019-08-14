import React, { useState } from 'react';
import {
    Draggable,
    DraggableStateSnapshot,
    DraggingStyle,
    Droppable,
    NotDraggingStyle,
} from 'react-beautiful-dnd';
import { Node } from '../Node';

import './NodeSelect.less';

export const nodeSelectDroppableId = 'nodeSelect';

const DraggableNode = ({
    node,
    index,
    dragStyle,
}: {
    node: string;
    index: number;
    dragStyle?: (
        style: DraggingStyle | NotDraggingStyle | undefined,
        snapshot: DraggableStateSnapshot
    ) => React.CSSProperties;
}) => {
    return (
        <Draggable draggableId={node} index={index}>
            {(provided, snapshot) => (
                <div
                    className="node-select"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={
                        (dragStyle &&
                            dragStyle(
                                provided.draggableProps.style,
                                snapshot
                            )) ||
                        provided.draggableProps.style
                    }
                >
                    <Node name={node} />
                </div>
            )}
        </Draggable>
    );
};

const NodeList = React.memo<any>(function NodeListHelper({
    nodeItems,
    dragStyle,
}: {
    nodeItems: any[];
    dragStyle?: (
        style: DraggingStyle | NotDraggingStyle | undefined,
        snapshot: DraggableStateSnapshot
    ) => React.CSSProperties;
}) {
    return nodeItems.map((nodeItem: any, index: number) => (
        <DraggableNode
            dragStyle={dragStyle}
            node={nodeItem}
            index={index}
            key={index}
        />
    ));
});

interface INodeSelectProps {
    nodes: string[];
    dragStyle?: (
        style: DraggingStyle | NotDraggingStyle | undefined,
        snapshot: DraggableStateSnapshot
    ) => React.CSSProperties;
}

export const NodeSelect: React.FC<INodeSelectProps> = props => {
    return (
        <div className="node-select">
            <Droppable
                isDropDisabled={true}
                direction="vertical"
                droppableId={nodeSelectDroppableId}
                ignoreContainerClipping
            >
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        <NodeList
                            nodeItems={props.nodes}
                            dragStyle={props.dragStyle}
                        />
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};
