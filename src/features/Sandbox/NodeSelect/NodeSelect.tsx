import classnames from 'classnames';
import React from 'react';
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
    node: INodeData;
    index: number;
    dragStyle?: (
        style: DraggingStyle | NotDraggingStyle | undefined,
        snapshot: DraggableStateSnapshot
    ) => React.CSSProperties;
}) => {
    return (
        <Draggable draggableId={node.id} index={index}>
            {(provided, snapshot) => (
                <div
                    className={classnames({
                        'node-select': true,
                        dragging: snapshot.isDragging,
                    })}
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
                    <Node data={node} />
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
    nodes: INodeData[];
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
