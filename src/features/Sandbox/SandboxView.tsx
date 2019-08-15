import { DraggableTabPane, DraggableTabs } from 'components/DraggableTabs';
import { VerticalCollapsible } from 'components/VerticalCollapsible/VerticalCollapsible';
import { Observer } from 'mobx-react-lite';
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

export const SandboxView = () => {
    const { sandboxStore } = useStore();

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
                <DraggableTabPane tab="Thing" tabId="0">
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
                                    collapsed={sandboxStore.nodeSelectClosed}
                                >
                                    <NodeSelect
                                        dragStyle={nodeDragStyle}
                                        nodes={['1', '2', '3']}
                                    />
                                </VerticalCollapsible>
                            )}
                        </Observer>
                        <Observer>{() => <SandboxCanvas />}</Observer>
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
            </DraggableTabs>
        </div>
    );
};
