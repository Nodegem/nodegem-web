import React, { useEffect } from 'react';
import {
    DragDropContext,
    Draggable,
    DraggableStateSnapshot,
    DraggingStyle,
    Droppable,
    DropResult,
    NotDraggingStyle,
    ResponderProvided,
} from 'react-beautiful-dnd';

import { Icon } from 'antd';
import classnames from 'classnames';
import { FlexRow } from 'components';
import { reorder } from 'utils';
import './DraggableTabs.less';

interface IDraggableTabPaneProps {
    tab: ITab;
    tabTemplate: (tab: ITab, isDragging: boolean) => JSX.Element;
}

const tabListId = 'tabList';

const tabDragStyle = (
    style: DraggingStyle | NotDraggingStyle | undefined,
    snapshot: DraggableStateSnapshot
): React.CSSProperties => {
    if (snapshot.draggingOver === tabListId || !snapshot.isDropAnimating) {
        return { ...style };
    }

    return {
        ...style,
        visibility: 'hidden',
        transitionDuration: '75ms',
    };
};

const DraggableTab = React.memo(
    ({
        tab,
        isActive,
        onClick,
        index,
        tabTemplate,
    }: IDraggableTabPaneProps & {
        isActive: boolean;
        onClick: (tabId: string) => void;
        index: number;
    }) => {
        return (
            <Draggable draggableId={tab.id} index={index}>
                {(provided, snapshot) => (
                    <div
                        onClick={() => onClick(tab.id)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={classnames({
                            tab: true,
                            'tab-drag': true,
                            active: isActive,
                        })}
                        style={tabDragStyle(
                            provided.draggableProps.style,
                            snapshot
                        )}
                    >
                        {tabTemplate(tab, snapshot.isDragging)}
                    </div>
                )}
            </Draggable>
        );
    }
);

interface IDragTab extends ITab {
    tabTemplate: (tab: ITab, isDragging: boolean) => JSX.Element;
    isActive: boolean;
    onClick: (tabId: string) => void;
}

interface IDraggableTabList {
    tabs: IDragTab[];
}

const DraggableTabList: React.FC<IDraggableTabList> = ({ tabs }) => {
    return (
        <>
            {tabs.map((tab: IDragTab, index: number) => (
                <DraggableTab {...tab} tab={tab} index={index} key={tab.id} />
            ))}
        </>
    );
};

export interface ITab {
    id: string;
    name: string;
    data: TabData;
}

interface IDraggableTabProps {
    tabs: ITab[];
    activeTab?: string;
    tabTemplate: (tab: ITab, isDragging: boolean) => JSX.Element;
    onTabReorder: (tabs: ITab[]) => void;
    onTabAdd?: () => void;
    onTabClick?: (tabId: string) => void;
}

export const DraggableTabs: React.FC<IDraggableTabProps> = ({
    activeTab,
    onTabAdd,
    onTabClick,
    onTabReorder,
    tabs,
    tabTemplate,
}) => {
    function onDragEnd(result: DropResult, provided: ResponderProvided) {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        if (result.source.droppableId !== result.destination.droppableId) {
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
            onTabClick(tabId);
        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <FlexRow className="tabs-container" flex={100}>
                <Droppable droppableId={tabListId} direction="horizontal">
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
                            <div
                                onMouseDown={onTabAdd}
                                className={classnames({
                                    tab: true,
                                    'tab-add': true,
                                })}
                            >
                                <Icon
                                    type="plus"
                                    style={{
                                        fontSize: '1.5em',
                                        marginRight: '15px',
                                    }}
                                />
                                New Tab
                            </div>
                        </div>
                    )}
                </Droppable>
            </FlexRow>
        </DragDropContext>
    );
};
