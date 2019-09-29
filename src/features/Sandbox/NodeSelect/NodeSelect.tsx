import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { Button, Col, Icon, Input, List, Row, Tabs, Tooltip } from 'antd';

import { FlexFill, Loader } from 'components';
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

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const DefinitionItem = (
    item: NodeDefinition,
    i: number,
    addNode: (definition: NodeDefinition) => void
) => (
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
                            <Icon type="drag" style={{ fontSize: '1.3em' }} />
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
);

interface INodeSelectProps {
    nodeOptions?: SelectFriendly<NodeDefinition>;
    loading: boolean;
    onFilter: (text: string) => void;
    addNode: (definition: NodeDefinition) => void;
}

export const NodeSelect: React.FC<INodeSelectProps> = ({
    nodeOptions,
    addNode,
    onFilter,
    loading,
}) => {
    const [tabIndex, setTabIndex] = useState('0');

    const handleTabClick = (activeKey?: string) => {
        if (activeKey) {
            setTabIndex(activeKey);
        }
    };

    return (
        <>
            <div className="node-select-container">
                {loading ? (
                    <Loader textSize={0.7} />
                ) : (
                    <>
                        {nodeOptions && (
                            <Tabs
                                activeKey={tabIndex}
                                onChange={handleTabClick}
                            >
                                {Object.keys(nodeOptions).map((k, index) => (
                                    <TabPane tab={k} key={index.toString()}>
                                        <div className="node-definition-container">
                                            {Object.keys(nodeOptions[k])
                                                .filter(optionKey =>
                                                    nodeOptions[k][
                                                        optionKey
                                                    ].any()
                                                )
                                                .map(
                                                    (itemListKey, subIndex) => (
                                                        <Droppable
                                                            isDropDisabled={
                                                                true
                                                            }
                                                            direction="vertical"
                                                            droppableId={
                                                                nodeSelectDroppableId
                                                            }
                                                            ignoreContainerClipping
                                                            key={subIndex}
                                                        >
                                                            {provided => (
                                                                <div
                                                                    className="node-category"
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    {...provided.droppableProps}
                                                                >
                                                                    <p className="definition-header">
                                                                        {
                                                                            itemListKey
                                                                        }
                                                                    </p>

                                                                    <List
                                                                        bordered
                                                                        itemLayout="vertical"
                                                                        dataSource={
                                                                            nodeOptions[
                                                                                k
                                                                            ][
                                                                                itemListKey
                                                                            ]
                                                                        }
                                                                        renderItem={(
                                                                            item: NodeDefinition,
                                                                            itemIndex
                                                                        ) =>
                                                                            DefinitionItem(
                                                                                item,
                                                                                itemIndex,
                                                                                addNode
                                                                            )
                                                                        }
                                                                    />

                                                                    {
                                                                        provided.placeholder
                                                                    }
                                                                </div>
                                                            )}
                                                        </Droppable>
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
                                    onChange={event =>
                                        onFilter(event.target.value)
                                    }
                                    prefix={<Icon type="search" />}
                                    allowClear
                                    placeholder="Filter Nodes"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};
