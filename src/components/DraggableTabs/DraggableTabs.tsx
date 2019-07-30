import React, { useState } from 'react';
import {
    DragDropContext,
    Draggable,
    DraggableStateSnapshot,
    DraggingStyle,
    Droppable,
    DroppableStateSnapshot,
    DropResult,
    NotDraggingStyle,
} from 'react-beautiful-dnd';

import classnames from 'classnames';
import { reorder } from 'utils';
import './DraggableTabs.less';

const defaultListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    display: 'flex',
    padding: 8,
    overflow: 'auto',
});

const defaultItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 4 * 2,
    margin: `0 ${8}px 0 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle,
});

interface IDraggableTabPaneProps {
    tab: JSX.Element | string;
    tabStyle?: (
        draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
        snapshot: DraggableStateSnapshot
    ) => React.CSSProperties;
    tabId: string;
}

export const DraggableTabPane: React.FC<IDraggableTabPaneProps> = props => {
    return <>{props.children}</>;
};

function DraggableTab({
    tab,
    tabStyle,
    tabId,
    isActive,
    onClick,
    index,
}: IDraggableTabPaneProps & {
    isActive: boolean;
    onClick: (tabId: string) => void;
    index: number;
}) {
    const classNames = classnames({ tab: true, active: isActive });
    return (
        <Draggable draggableId={tabId} index={index}>
            {(provided, snapshot) => (
                <div
                    onClick={() => onClick(tabId)}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={classNames}
                    style={
                        (tabStyle &&
                            tabStyle(
                                provided.draggableProps.style,
                                snapshot
                            )) ||
                        defaultItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                        )
                    }
                >
                    {tab}
                </div>
            )}
        </Draggable>
    );
}

const DraggableTabList = React.memo(function TabList({ tabs }: any) {
    return tabs.map((tab: any, index: number) => (
        <DraggableTab {...tab} index={index} key={tab.tabId} />
    ));
});
interface IDraggableTabProps {
    onTabClick?: (tabId: string) => void;
    tabBarStyle?: (snapshot: DroppableStateSnapshot) => React.CSSProperties;
    defaultActiveTab?: string;
}

export const DraggableTabs: React.FC<IDraggableTabProps> = props => {
    const [state, setState] = useState({
        tabs: React.Children.toArray(props.children),
        activeTab: props.defaultActiveTab || '0',
    });

    function onDragEnd(result: DropResult) {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const tabs = reorder(
            state.tabs,
            result.source.index,
            result.destination.index
        );

        setState({ ...state, tabs });
    }

    function onClick(tabId: string) {
        setState({ ...state, activeTab: tabId });
        if (props.onTabClick) {
            props.onTabClick(tabId);
        }
    }

    const content = state.tabs.find(
        (x: any) => x.props.tabId === state.activeTab
    );

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="tabList" direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={
                                (props.tabBarStyle &&
                                    props.tabBarStyle(snapshot)) ||
                                defaultListStyle(snapshot.isDraggingOver)
                            }
                        >
                            <DraggableTabList
                                tabs={state.tabs.map((x: any) => ({
                                    ...x.props,
                                    isActive: state.activeTab === x.props.tabId,
                                    onClick,
                                }))}
                            />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <div className="tab-content">{content}</div>
        </>
    );
};
