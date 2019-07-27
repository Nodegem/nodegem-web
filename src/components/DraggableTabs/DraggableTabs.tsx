import { Tabs } from 'antd';
import { TabsProps } from 'antd/lib/tabs';
import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import './DraggableTabs.less';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export default class DraggableTabs extends React.Component<
    TabsProps,
    { tabs: any[] }
> {
    public state = {
        tabs: [] as any[],
    };

    public componentDidMount() {
        const { children } = this.props;
        const tabs = [] as any[];
        React.Children.forEach(children, c => {
            tabs.push(c);
        });
        this.setState({ tabs });
    }

    public onDragEnd = result => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            this.state.tabs,
            result.source.index,
            result.destination.index
        );

        this.setState({
            tabs: items,
        });
    };

    public renderTabBar = (props, DefaultTabBar: React.ComponentClass) => {
        let index = -1;

        return (
            <Droppable droppableId="droppable" direction="horizontal">
                {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        <DefaultTabBar {...props}>
                            {node => {
                                index++;
                                return (
                                    <Draggable
                                        key={node.key}
                                        draggableId={node.key}
                                        index={index}
                                    >
                                        {(
                                            draggableProvided,
                                            draggableSnapshot
                                        ) => (
                                            <span
                                                ref={draggableProvided.innerRef}
                                                {...draggableProvided.draggableProps}
                                                {...draggableProvided.dragHandleProps}
                                                style={
                                                    draggableProvided
                                                        .draggableProps.style
                                                }
                                            >
                                                {node}
                                            </span>
                                        )}
                                    </Draggable>
                                );
                            }}
                        </DefaultTabBar>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        );
    };

    public render() {
        const { tabs } = this.state;

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Tabs renderTabBar={this.renderTabBar} {...this.props}>
                    {tabs}
                </Tabs>
            </DragDropContext>
        );
    }
}
