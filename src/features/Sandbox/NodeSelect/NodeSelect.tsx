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
import { definitionToNode } from '../utils';
import './NodeSelect.less';

export const nodeSelectDroppableId = 'nodeSelect';

const NodeList = React.memo<any>(function NodeListHelper({
    definitions,
    dragStyle,
}: {
    definitions: NodeDefinition[];
    dragStyle?: (
        style: DraggingStyle | NotDraggingStyle | undefined,
        snapshot: DraggableStateSnapshot
    ) => React.CSSProperties;
}) {
    return definitions.map((definition: NodeDefinition, index: number) => (
        <Draggable key={index} draggableId={`${index}`} index={index}>
            {(provided, snapshot) => (
                <div
                    className={classnames({
                        'draggable-node': true,
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
                    <Node data={definitionToNode(definition)} />
                </div>
            )}
        </Draggable>
    ));
});

interface INodeSelectProps {
    definitions: NodeDefinition[];
    dragStyle?: (
        style: DraggingStyle | NotDraggingStyle | undefined,
        snapshot: DraggableStateSnapshot
    ) => React.CSSProperties;
}

export const NodeSelect: React.FC<INodeSelectProps> = ({
    definitions,
    dragStyle,
}) => {
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
                                definitions={definitions}
                                dragStyle={dragStyle}
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
