import { Tabs } from 'antd';
import { TabsProps } from 'antd/lib/tabs';
import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export default class DraggableTabs extends React.Component<
    TabsProps,
    { order: any[] }
> {
    public state = {
        order: [] as any[],
    };

    public moveTabNode = (dragKey, hoverKey) => {
        const newOrder = this.state.order.slice();
        const { children } = this.props;

        React.Children.forEach(children, (c: any) => {
            if (newOrder.indexOf(c.key) === -1) {
                newOrder.push(c.key);
            }
        });

        const dragIndex = newOrder.indexOf(dragKey);
        const hoverIndex = newOrder.indexOf(hoverKey);

        newOrder.splice(dragIndex, 1);
        newOrder.splice(hoverIndex, 0, dragKey);

        this.setState({
            order: newOrder,
        });
    };

    public onDragEnd = result => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            this.state.order,
            result.source.index,
            result.destination.index
        );

        this.setState({
            order: items,
        });
    };

    public renderTabBar = (props, DefaultTabBar) => (
        <DefaultTabBar {...props}>
            {node => (
                <div />
                // <WrapTabNode
                //     key={node.key}
                //     index={node.key}
                //     moveTabNode={this.moveTabNode}
                // >
                //     {node}
                // </WrapTabNode>
            )}
        </DefaultTabBar>
    );

    public render() {
        const { order } = this.state;
        const { children } = this.props;

        const tabs: any[] = [];
        React.Children.forEach(children, (c: any) => {
            tabs.push(c);
        });

        const orderTabs = tabs.slice().sort((a, b) => {
            const orderA = order.indexOf(a.key);
            const orderB = order.indexOf(b.key);

            if (orderA !== -1 && orderB !== -1) {
                return orderA - orderB;
            }
            if (orderA !== -1) {
                return -1;
            }
            if (orderB !== -1) {
                return 1;
            }

            const ia = tabs.indexOf(a);
            const ib = tabs.indexOf(b);

            return ia - ib;
        });

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <Tabs renderTabBar={this.renderTabBar} {...this.props}>
                            {orderTabs}
                        </Tabs>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}
