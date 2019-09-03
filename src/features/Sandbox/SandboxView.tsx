import { DraggableTabs } from 'components/DraggableTabs';
import { VerticalCollapsible } from 'components/VerticalCollapsible/VerticalCollapsible';
import _ from 'lodash';
import { uuid } from 'lodash-uuid';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import {
    DragDropContext,
    DraggableStateSnapshot,
    DraggingStyle,
    NotDraggingStyle,
} from 'react-beautiful-dnd';
import { DragEndProps, TabData, testData, useStore } from 'stores';
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

export const fakeNodeData: INodeUIData[] = [
    {
        id: '0',
        portData: {
            flowInputs: [
                {
                    id: '1',
                    name: '',
                    type: 'flow',
                    connected: false,
                },
            ],
            flowOutputs: [],
            valueInputs: [
                {
                    id: '2',
                    name: '',
                    type: 'value',
                    connected: false,
                },
            ],
            valueOutputs: [
                {
                    id: '5',
                    name: '',
                    type: 'value',
                    connected: false,
                },
            ],
        },
        title: 'A title',
    },
    {
        id: '1',
        portData: {
            flowInputs: [
                {
                    id: '1',
                    name: '',
                    type: 'flow',
                    connected: false,
                },
            ],
            flowOutputs: [],
            valueInputs: [
                {
                    id: '2',
                    name: '',
                    type: 'value',
                    connected: false,
                },
            ],
            valueOutputs: [
                {
                    id: '5',
                    name: '',
                    type: 'value',
                    connected: false,
                },
            ],
        },
        title: 'A title',
    },
    {
        id: '2',
        portData: {
            flowInputs: [
                {
                    id: '1',
                    name: '',
                    type: 'flow',
                    connected: false,
                },
            ],
            flowOutputs: [],
            valueInputs: [],
            valueOutputs: [],
        },
        title: 'A title',
    },
    {
        id: '3',
        portData: {
            flowInputs: [
                {
                    id: '1',
                    name: '',
                    type: 'flow',
                    connected: false,
                },
            ],
            flowOutputs: [],
            valueInputs: [],
            valueOutputs: [],
        },
        title: 'A title',
    },
    {
        id: '4',
        portData: {
            flowInputs: [
                {
                    id: '1',
                    name: '',
                    type: 'flow',
                    connected: false,
                },
            ],
            flowOutputs: [],
            valueInputs: [],
            valueOutputs: [],
        },
        title: 'A title',
    },
];

export const SandboxView = observer(() => {
    const { sandboxStore } = useStore();
    const {
        tabs,
        addTab,
        setTabs,
        dragEndObservable,
        setActiveTab,
        activeTab,
        toggleNodeSelect,
        nodeSelectClosed,
        nodes,
        toggleNodeInfo,
        nodeInfoClosed,
        fakeLink,
        links,
        sandboxManager,
        linksVisible,
        isDrawing,
    } = sandboxStore;

    useEffect(() => {
        setTabs([...testData], true);
        dragEndObservable.subscribe(onDragEnd);
        return () => {
            sandboxStore.dispose();
        };
    }, [sandboxStore]);

    function onDragEnd({ result }: DragEndProps) {
        if (!result.destination) {
            return;
        }

        if (
            result.source.droppableId === nodeSelectDroppableId &&
            result.destination.droppableId === sandboxDroppableId
        ) {
            const nodeData = fakeNodeData[result.source.index];
            sandboxManager.addNode(
                _.cloneDeep(nodeData),
                uuid(),
                sandboxManager.mousePos
            );
        }
    }

    function handleTabClick(tabId: string, data: TabData) {
        setActiveTab(tabId);
    }

    function handleTabReorder(orderedTabs: any[]) {
        setTabs(orderedTabs.map(x => x.data));
    }

    return (
        <div className="sandbox-view-container">
            <DraggableTabs
                tabs={tabs.map(t => ({
                    id: t.graph.id!,
                    name: t.graph.name!,
                    data: t,
                }))}
                activeTab={(activeTab && activeTab.graph.id) || '0'}
                onTabReorder={handleTabReorder}
                dragEndObservable={dragEndObservable}
                onTabAdd={addTab}
                onTabClick={handleTabClick}
            />
            <DragDropContext
                onDragEnd={(result, provided) =>
                    dragEndObservable.execute({ result, provided })
                }
            >
                <div className="tab-content">
                    <VerticalCollapsible
                        width="300px"
                        minWidth="0"
                        onTabClick={toggleNodeSelect}
                        tabContent="Nodes"
                        collapsed={nodeSelectClosed}
                    >
                        <NodeSelect
                            dragStyle={nodeDragStyle}
                            nodes={fakeNodeData}
                        />
                    </VerticalCollapsible>
                    <SandboxCanvas
                        getDrawLinkRef={fakeLink.getElementRef}
                        isDrawing={isDrawing}
                        links={links}
                        sandboxManager={sandboxManager}
                        nodes={nodes}
                        visibleLinks={linksVisible}
                    />
                    <VerticalCollapsible
                        onTabClick={toggleNodeInfo}
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
