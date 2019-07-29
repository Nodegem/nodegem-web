import React, { useState } from 'react';
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
    ResponderProvided,
} from 'react-beautiful-dnd';
import { reorder } from 'utils';

export const droppableDeleteId = 'deleteNode';

const Node = ({ node, index }) => {
    return (
        <Draggable draggableId={node} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {node}
                </div>
            )}
        </Draggable>
    );
};

const NodeList = React.memo<any>(function NodeListHelper({
    nodeItems,
}: {
    nodeItems: number[];
}) {
    return nodeItems.map((nodeItem: number, index: number) => (
        <Node node={nodeItem} index={index} key={index} />
    ));
});

export const NodeSelect: React.FC = props => {
    const testItems = [1, 2, 3, 4, 5];

    function onDragEnd(result: DropResult, provided: ResponderProvided) {
        if (!result.destination) {
            return;
        }

        if (
            result.source.droppableId !== droppableDeleteId &&
            result.destination.droppableId === droppableDeleteId
        ) {
            // Delete stuff
            return;
        }
    }

    return (
        <div className="node-select">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
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
