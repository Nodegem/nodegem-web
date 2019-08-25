import React, { useEffect, useState } from 'react';
import {
    Draggable,
    DraggableStateSnapshot,
    DraggingStyle,
    Droppable,
    NotDraggingStyle,
} from 'react-beautiful-dnd';

import { Button, Col, Row } from 'antd';
import classnames from 'classnames';
import { DragEndProps } from 'stores';
import { reorder, SimpleObservable } from 'utils';
import './DraggableTabs.less';

interface IDraggableTabPaneProps {
    tabStyle?: (
        draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
        snapshot: DraggableStateSnapshot
    ) => React.CSSProperties;
    tabId: string;
    name: string;
    tabTemplate?: JSX.Element;
}

function DraggableTab({
    tabId,
    isActive,
    onClick,
    index,
    name,
    tabTemplate,
}: IDraggableTabPaneProps & {
    isActive: boolean;
    onClick: (tabId: string) => void;
    index: number;
}) {
    return (
        <Draggable draggableId={tabId} index={index}>
            {(provided, snapshot) => (
                <div
                    onClick={() => onClick(tabId)}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={classnames({
                        tab: true,
                        active: isActive,
                        dragging: snapshot.isDragging,
                    })}
                >
                    <div className="tab-container">{tabTemplate || name}</div>
                </div>
            )}
        </Draggable>
    );
}

interface IDraggableTabList {
    tabs: any[];
}

const DraggableTabList: React.FC<IDraggableTabList> = ({ tabs }) => {
    return (
        <>
            {tabs.map((tab: any, index: number) => (
                <DraggableTab
                    {...tab}
                    tabId={tab.id}
                    index={index}
                    key={tab.id}
                />
            ))}
        </>
    );
};

interface ITab {
    id: string;
    name: string;
    data: any;
}

interface IDraggableTabProps {
    tabs: ITab[];
    activeTab?: string;
    tabControls?: JSX.Element;
    tabTemplate?: JSX.Element;
    dragEndObservable: SimpleObservable<DragEndProps>;
    onTabReorder: (tabs: ITab[]) => void;
    onTabAdd?: () => void;
    onTabClick?: (tabId: string, data: any) => void;
}

export const DraggableTabs: React.FC<IDraggableTabProps> = ({
    activeTab,
    dragEndObservable,
    onTabAdd,
    onTabClick,
    onTabReorder,
    tabs,
    tabControls,
    tabTemplate,
}) => {
    useEffect(() => {
        dragEndObservable.subscribe(onDragEnd);

        return () => {
            dragEndObservable.unsubscribe(onDragEnd);
        };
    }, [tabs, activeTab]);

    function onDragEnd({ result, provided }: DragEndProps) {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const orderedTabs = reorder(
            tabs,
            result.source.index,
            result.destination.index
        );

        onTabReorder(orderedTabs);
    }

    function onClick(tabId: string) {
        if (onTabClick) {
            const tab = tabs.find(x => x.id === tabId);
            onTabClick(tabId, tab && tab.data);
        }
    }

    return (
        <Row className="tabs-container">
            <Col span={22}>
                <Droppable droppableId="tabList" direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={classnames({
                                'tab-list': true,
                                'dragging-over': snapshot.isDraggingOver,
                            })}
                        >
                            <DraggableTabList
                                tabs={tabs.map((x: ITab) => ({
                                    id: x.id,
                                    name: x.name,
                                    data: x.data,
                                    isActive: activeTab === x.id,
                                    onClick,
                                    tabTemplate,
                                }))}
                            />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </Col>
            <Col span={2}>
                <div className="tab-controls">
                    {tabControls}
                    <Button
                        type="dashed"
                        size="large"
                        ghost
                        icon="plus"
                        style={{ width: '45px' }}
                        onClick={onTabAdd}
                    />
                </div>
            </Col>
        </Row>
    );
};
