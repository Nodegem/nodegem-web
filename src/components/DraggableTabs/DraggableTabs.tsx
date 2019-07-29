import React, { useState } from 'react';
import {
    DragDropContext,
    Draggable,
    DraggingStyle,
    Droppable,
    DropResult,
    NotDraggingStyle,
} from 'react-beautiful-dnd';

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
        isDragging: boolean,
        draggableStyle: DraggingStyle | NotDraggingStyle | undefined
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
    onClick,
    index,
}: IDraggableTabPaneProps & {
    onClick: (tabId: string) => void;
    index: number;
}) {
    return (
        <Draggable draggableId={tabId} index={index}>
            {(provided, snapshot) => (
                <div
                    onClick={() => onClick && onClick(tabId)}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={
                        (tabStyle &&
                            tabStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
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
    tabBarStyle?: (isDraggingOver: boolean) => React.CSSProperties;
    defaultActiveTab?: string;
}

export const DraggableTabs: React.FC<IDraggableTabProps> = props => {
    const [state, setState] = useState({
        tabs: React.Children.toArray(props.children),
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

        setState({ tabs });
    }

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
                                    props.tabBarStyle(
                                        snapshot.isDraggingOver
                                    )) ||
                                defaultListStyle(snapshot.isDraggingOver)
                            }
                        >
                            <DraggableTabList
                                tabs={state.tabs.map((x: any) => ({
                                    ...x.props,
                                    onClick: props.onTabClick,
                                }))}
                            />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <div className="tab-container">{state.tabs[0]}</div>
        </>
    );
};
