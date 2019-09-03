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

import { Icon, Input } from 'antd';
import './NodeSelect.less';

export const nodeSelectDroppableId = 'nodeSelect';

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
        <Draggable key={index} draggableId={nodeItem.id} index={index}>
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
                    <Node data={nodeItem} />
                </div>
            )}
        </Draggable>
    ));
});

interface INodeSelectProps {
    nodes: INodeUIData[];
    dragStyle?: (
        style: DraggingStyle | NotDraggingStyle | undefined,
        snapshot: DraggableStateSnapshot
    ) => React.CSSProperties;
}

export const NodeSelect: React.FC<INodeSelectProps> = props => {
    return (
        <>
            <div className="node-select-container">
                <Droppable
                    isDropDisabled={true}
                    direction="vertical"
                    droppableId={nodeSelectDroppableId}
                    ignoreContainerClipping
                >
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="node-select-drop-container"
                        >
                            <NodeList
                                nodeItems={props.nodes}
                                dragStyle={props.dragStyle}
                            />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
            <div className="filter">
                <Input
                    prefix={<Icon type="search" />}
                    allowClear
                    placeholder="Filter Nodes"
                />
            </div>
        </>
    );
};
