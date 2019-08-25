import { DraggableTabs } from 'components/DraggableTabs';
import { VerticalCollapsible } from 'components/VerticalCollapsible/VerticalCollapsible';
import { keys, observable } from 'mobx';
import { Observer, observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import {
    DragDropContext,
    DraggableStateSnapshot,
    DraggingStyle,
    DropResult,
    NotDraggingStyle,
    ResponderProvided,
} from 'react-beautiful-dnd';
import { TabData, useStore } from 'stores';
import { SimpleObservable } from 'utils';
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
    const [state] = useState({
        dragEndObservable: new SimpleObservable<{
            result: DropResult;
            provided: ResponderProvided;
        }>(),
    });
    const { sandboxStore } = useStore();
    const {
        tabs,
        addTab,
        reorderTabs,
        setActiveTab,
        activeTab,
        toggleNodeSelect,
        nodeSelectClosed,
        sandboxManager,
        toggleNodeInfo,
        nodeInfoClosed,
    } = sandboxStore;

    useEffect(() => {
        return () => {
            state.dragEndObservable.clear();
            sandboxStore.dispose();
        };
    }, [sandboxStore]);

    // function onDragEnd(result: DropResult, provided: ResponderProvided) {
    //     if (!result.destination) {
    //         return;
    //     }

    //     if (
    //         result.source.droppableId === nodeSelectDroppableId &&
    //         result.destination.droppableId === sandboxDroppableId
    //     ) {
    //         console.log('Adding node');
    //         return;
    //     }

    //     if (
    //         result.source.droppableId === sandboxDroppableId &&
    //         result.destination.droppableId === nodeSelectDroppableId
    //     ) {
    //         console.log('Deleting node');
    //         return;
    //     }
    // }

    function handleTabClick(tabId: string, data: TabData) {
        setActiveTab(tabId);
    }

    function handleTabReorder(orderedTabs: any[]) {
        reorderTabs(orderedTabs.map(x => x.data));
    }

    return (
        <div className="sandbox-view-container">
            <DragDropContext
                onDragEnd={(result, provided) =>
                    state.dragEndObservable.execute({ result, provided })
                }
            >
                <DraggableTabs
                    tabs={tabs.map(t => ({
                        id: t.graph.id,
                        name: t.graph.name,
                        data: t,
                    }))}
                    activeTab={(activeTab && activeTab.graph.id) || '0'}
                    onTabReorder={handleTabReorder}
                    dragEndObservable={state.dragEndObservable}
                    onTabAdd={addTab}
                    onTabClick={handleTabClick}
                />
                <div className="tab-content">
                    <VerticalCollapsible
                        width="300px"
                        minWidth="0"
                        onTabClick={() => toggleNodeSelect()}
                        tabContent="Nodes"
                        collapsed={nodeSelectClosed}
                    >
                        <NodeSelect
                            dragStyle={nodeDragStyle}
                            nodes={fakeNodeData}
                        />
                    </VerticalCollapsible>
                    <SandboxCanvas
                        manager={sandboxManager}
                        graph={activeTab && activeTab.graph}
                    />
                    <VerticalCollapsible
                        onTabClick={() => toggleNodeInfo()}
                        tabDirection="left"
                        tabContent="Node Info"
                        collapsed={nodeInfoClosed}
                    >
                        Hello I can collapse
                    </VerticalCollapsible>
                </div>
            </DragDropContext>
        </div>
    );
});
