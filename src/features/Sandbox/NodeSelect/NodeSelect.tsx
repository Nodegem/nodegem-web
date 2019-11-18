import React, { useState, useRef, useEffect } from 'react';
import { Draggable, Droppable, DroppableProvided } from 'react-beautiful-dnd';

import {
    Button,
    Col,
    Icon,
    Input,
    List,
    Row,
    Tabs,
    Tooltip,
    Empty,
} from 'antd';

import { FlexFill, Loader } from 'components';
import _ from 'lodash';
import './NodeSelect.less';

const { TabPane } = Tabs;

export const nodeSelectDroppableId = 'nodeSelect';

function getStyle(style, snapshot) {
    if (!snapshot.isDropAnimating) {
        return style;
    }
    return {
        ...style,
        transitionDuration: `0.001s`,
    };
}

interface IDefinitionItemProps {
    item: NodeDefinition;
    i: number;
    addNode: (definition: NodeDefinition) => void;
}

const DefinitionItem: React.FC<IDefinitionItemProps> = React.memo(
    ({ item, i, addNode }) => (
        <Draggable
            key={i}
            disableInteractiveElementBlocking
            draggableId={item.fullName}
            index={i}
        >
            {(provided, snapshot) => (
                <span
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getStyle(provided.draggableProps.style, snapshot)}
                >
                    <List.Item
                        className="definition-item"
                        style={{
                            userSelect: 'none',
                            alignItems: 'center',
                        }}
                        extra={
                            <span>
                                <Tooltip title={item.description || 'N/A'}>
                                    <Button
                                        style={{
                                            visibility:
                                                snapshot.isDragging ||
                                                snapshot.isDropAnimating
                                                    ? 'hidden'
                                                    : 'visible',
                                        }}
                                        icon="info-circle"
                                        type="link"
                                        size="large"
                                    />
                                </Tooltip>
                                <Tooltip title="Add">
                                    <Button
                                        style={{
                                            visibility:
                                                snapshot.isDragging ||
                                                snapshot.isDropAnimating
                                                    ? 'hidden'
                                                    : 'visible',
                                        }}
                                        onClick={() => addNode(item)}
                                        icon="plus-square"
                                        type="link"
                                        size="large"
                                    />
                                </Tooltip>
                            </span>
                        }
                    >
                        <Row>
                            <Col span={2}>
                                <Icon
                                    type="drag"
                                    style={{ fontSize: '1.3em' }}
                                />
                            </Col>
                            <Col span={14} offset={4}>
                                <span style={{ flex: 1, alignSelf: 'center' }}>
                                    {item.title}
                                </span>
                            </Col>
                        </Row>
                    </List.Item>
                </span>
            )}
        </Draggable>
    )
);

interface INodeCategoryProps {
    provided: DroppableProvided;
    title: string;
    definitions: NodeDefinition[];
    addNode: (definition: NodeDefinition) => void;
}

const NodeCategory: React.FC<INodeCategoryProps> = React.memo(
    ({ provided, title, definitions, addNode }) => (
        <div
            className="node-category"
            ref={provided.innerRef}
            {...provided.droppableProps}
        >
            <p className="definition-header">{title}</p>

            <List
                bordered
                itemLayout="vertical"
                dataSource={definitions}
                renderItem={(item: NodeDefinition, itemIndex) => (
                    <DefinitionItem
                        item={item}
                        i={itemIndex}
                        addNode={addNode}
                    />
                )}
            />
            {provided.placeholder}
        </div>
    )
);

interface INodeSelectProps {
    setInputRef: (ref: React.RefObject<Input>) => void;
    nodeOptions?: SelectFriendly<NodeDefinition>;
    loading: boolean;
    onFilter: (text: string) => void;
    addNode: (definition: NodeDefinition) => void;
}

export const NodeSelect: React.FC<INodeSelectProps> = ({
    setInputRef,
    nodeOptions,
    addNode,
    onFilter,
    loading,
}) => {
    const ref = useRef<Input>(null);
    const [tabIndex, setTabIndex] = useState('0');

    useEffect(() => {
        setInputRef(ref);
        if (!nodeOptions || Object.keys(nodeOptions).length <= 1) {
            setTabIndex('0');
        }
    }, [ref, nodeOptions]);

    const handleTabClick = (activeKey?: string) => {
        if (activeKey) {
            setTabIndex(activeKey);
        }
    };

    const getDefinitions = (key: string) =>
        Object.keys(nodeOptions![key]).filter(optionKey =>
            nodeOptions![key][optionKey].any()
        );

    return (
        <div className="node-select-container">
            {loading ? (
                <Loader textSize={0.7} />
            ) : (
                <>
                    {nodeOptions && (
                        <Tabs activeKey={tabIndex} onChange={handleTabClick}>
                            {Object.keys(nodeOptions).map((k, index) => (
                                <TabPane tab={k} key={index.toString()}>
                                    <div className="node-definition-container">
                                        {!getDefinitions(k).any() ? (
                                            <>
                                                <Empty description="No nodes found" />
                                            </>
                                        ) : (
                                            getDefinitions(k).map(
                                                (itemListKey, subIndex) => (
                                                    <Droppable
                                                        isDropDisabled={true}
                                                        direction="vertical"
                                                        droppableId={`${nodeSelectDroppableId}-${_.uniqueId()}-${subIndex}`}
                                                        ignoreContainerClipping
                                                        key={subIndex}
                                                    >
                                                        {provided => (
                                                            <NodeCategory
                                                                addNode={
                                                                    addNode
                                                                }
                                                                definitions={
                                                                    nodeOptions[
                                                                        k
                                                                    ][
                                                                        itemListKey
                                                                    ]
                                                                }
                                                                provided={
                                                                    provided
                                                                }
                                                                title={
                                                                    itemListKey
                                                                }
                                                            />
                                                        )}
                                                    </Droppable>
                                                )
                                            )
                                        )}
                                    </div>
                                </TabPane>
                            ))}
                        </Tabs>
                    )}
                    <FlexFill />
                    {nodeOptions && (
                        <div className="filter">
                            <Input
                                ref={ref}
                                onChange={event => onFilter(event.target.value)}
                                prefix={<Icon type="search" />}
                                allowClear
                                placeholder="Filter Nodes"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
