import { DraggableTabPane, DraggableTabs } from 'components/DraggableTabs';
import { VerticalCollapsible } from 'components/VerticalCollapsible/VerticalCollapsible';
import { keys } from 'mobx';
import { Observer, observer } from 'mobx-react-lite';
import React from 'react';
import {
    DragDropContext,
    DraggableStateSnapshot,
    DraggingStyle,
    DropResult,
    NotDraggingStyle,
    ResponderProvided,
} from 'react-beautiful-dnd';
import { useStore } from 'stores';
import { NodeSelect, nodeSelectDroppableId } from './NodeSelect/NodeSelect';
import { SandboxCanvas, sandboxDroppableId } from './Sandbox/SandboxCanvas';
import './SandboxView.less';

const nodeDragStyle = (
    style: DraggingStyle | NotDraggingStyle | undefined,
    snapshot: DraggableStateSnapshot
): React.CSSProperties => {
    if (
        snapshot.draggingOver !== sandboxDroppableId ||
        !snapshot.isDropAnimating
    ) {
        return { ...style };
    }

    return {
        ...style,
        visibility: 'hidden',
        transitionDuration: '75ms',
    };
};

export const fakeNodeData: INodeData[] = [
    {
        id: 'test',
        portData: {
            flowInputs: [
                {
                    id: '1',
                },
            ],
            flowOutputs: [],
            valueInputs: [
                {
                    id: '2',
                },
            ],
            valueOutputs: [
                {
                    id: '5',
                },
            ],
        },
        title: 'A title',
    },
];

export const SandboxView = observer(() => {
    const { sandboxStore } = useStore();
    const { tabs } = sandboxStore;

    function onDragEnd(result: DropResult, provided: ResponderProvided) {
        if (!result.destination) {
            return;
        }

        if (
            result.source.droppableId === nodeSelectDroppableId &&
            result.destination.droppableId === sandboxDroppableId
        ) {
            console.log('Adding node');
            return;
        }

        if (
            result.source.droppableId === sandboxDroppableId &&
            result.destination.droppableId === nodeSelectDroppableId
        ) {
            console.log('Deleting node');
            return;
        }
    }

    return (
        <div className="sandbox-view-container">
            <DraggableTabs>
                {tabs.map(tab => (
                    <DraggableTabPane
                        key={tab.graph.id}
                        tab={tab.graph.name}
                        tabId={tab.graph.id}
                    >
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Observer>
                                {() => (
                                    <VerticalCollapsible
                                        width="300px"
                                        minWidth="0"
                                        onTabClick={() =>
                                            sandboxStore.toggleNodeSelect()
                                        }
                                        tabContent="Nodes"
                                        collapsed={
                                            sandboxStore.nodeSelectClosed
                                        }
                                    >
                                        <NodeSelect
                                            dragStyle={nodeDragStyle}
                                            nodes={fakeNodeData}
                                        />
                                    </VerticalCollapsible>
                                )}
                            </Observer>
                            <SandboxCanvas manager={tab.manager} />
                            <Observer>
                                {() => (
                                    <VerticalCollapsible
                                        onTabClick={() =>
                                            sandboxStore.toggleNodeInfo()
                                        }
                                        tabDirection="left"
                                        tabContent="Node Info"
                                        collapsed={sandboxStore.nodeInfoClosed}
                                    >
                                        Hello I can collapse
                                    </VerticalCollapsible>
                                )}
                            </Observer>
                        </DragDropContext>
                    </DraggableTabPane>
                ))}
            </DraggableTabs>
        </div>
    );
});
