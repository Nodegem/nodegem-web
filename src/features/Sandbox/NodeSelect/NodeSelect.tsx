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

import { Icon, Input, Typography } from 'antd';
import { definitionToNode } from '../utils';

import './NodeSelect.less';

const { Title } = Typography;

export const nodeSelectDroppableId = 'nodeSelect';

const NodeList: React.FC<INodeSelectProps> = ({ nodeOptions, dragStyle }) => {
    return (
        <>
            {Object.keys(nodeOptions).map((key: string, index: number) => {
                return (
                    <>
                        {nodeOptions[key].map((d, dIndex) => (
                            <Draggable
                                key={dIndex}
                                draggableId={`${dIndex}`}
                                index={dIndex}
                            >
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
                                                    provided.draggableProps
                                                        .style,
                                                    snapshot
                                                )) ||
                                            provided.draggableProps.style
                                        }
                                    >
                                        <Node data={definitionToNode(d)} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                    </>
                );
            })}
        </>
    );
};

interface INodeSelectProps {
    nodeOptions: NodeSelectOptions;
    dragStyle?: (
        style: DraggingStyle | NotDraggingStyle | undefined,
        snapshot: DraggableStateSnapshot
    ) => React.CSSProperties;
}

export const NodeSelect: React.FC<INodeSelectProps> = ({
    nodeOptions,
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
                                nodeOptions={nodeOptions}
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
