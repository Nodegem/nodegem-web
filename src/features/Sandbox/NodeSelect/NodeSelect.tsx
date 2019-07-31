import React, { useState } from 'react';
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
    ResponderProvided,
} from 'react-beautiful-dnd';
import { Node } from '../Node';

import './NodeSelect.less';

export const droppableDeleteId = 'deleteNode';

const DraggableNode = ({ node, index }) => {
    return (
        <Draggable draggableId={node} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={provided.draggableProps.style}
                >
                    <Node>{node}</Node>
                </div>
            )}
        </Draggable>
    );
};

const NodeList = React.memo<any>(function NodeListHelper({
    nodeItems,
}: {
    nodeItems: any[];
}) {
    return nodeItems.map((nodeItem: number, index: number) => (
        <DraggableNode node={nodeItem} index={index} key={index} />
    ));
});

export const NodeSelect: React.FC = props => {
    const testItems = ['test', 'sdasda', 'sdasdasdas', 'sdasdsadasd'];

    function onDragEnd(result: DropResult, provided: ResponderProvided) {
        if (!result.destination) {
            return;
        }

        if (
            result.source.droppableId !== droppableDeleteId &&
            result.destination.droppableId === droppableDeleteId
        ) {
            // Delete stuff?
            return;
        }
    }

    return (
        <div className="node-select">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                    isDropDisabled={true}
                    direction="vertical"
                    droppableId={droppableDeleteId}
                    ignoreContainerClipping
                >
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <NodeList nodeItems={testItems} />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};
