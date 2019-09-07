import { Button, Dropdown, Icon, Menu } from 'antd';
import { DraggableTabs, ITab } from 'components/DraggableTabs';
import { VerticalCollapsible } from 'components/VerticalCollapsible/VerticalCollapsible';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
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
import { definitionToNode } from './utils';

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

export const fakeDefinitions: NodeDefinition[] = [
    {
        description: 'this is a description',
        title: 'Node 1',
        fullName: 'a full title',
        flowInputs: [{ key: '0', label: 'flow-in' }],
        flowOutputs: [{ key: '0', label: 'flow-out' }],
        valueInputs: [
            {
                key: '0',
                label: 'value-in',
                defaultValue: 0,
                valueType: 0,
            },
        ],
        valueOutputs: [{ key: '0', label: 'value-out' }],
    },
    {
        description: 'this is a description',
        title: 'Node 2',
        fullName: 'a full title',
        flowInputs: [{ key: '0', label: 'flow-in' }],
        flowOutputs: [{ key: '0', label: 'flow-out' }],
        valueInputs: [],
        valueOutputs: [{ key: '0', label: 'value-out' }],
    },
];

const TabTemplate: React.FC<ITab & { deleteTab: (tabId: string) => void }> = ({
    name,
    id,
    data,
    deleteTab,
}) => {
    const [deleteVisible, toggleDelete] = useState(false);

    return (
        <div
            style={{ padding: '8px 45px' }}
            onMouseEnter={() => toggleDelete(true)}
            onMouseLeave={() => toggleDelete(false)}
        >
            <span>{name}</span>
            {deleteVisible && (
                <span style={{ position: 'absolute' }}>
                    <Button
                        onClick={() => deleteTab(id)}
                        style={{
                            position: 'absolute',
                            right: '-35px',
                            top: '-1px',
                        }}
                        type="link"
                        size="small"
                        icon="close"
                    />
                </span>
            )}
        </div>
    );
};

const GraphControls: React.FC = () => {
    return (
        <>
            <div>Test</div>
        </>
    );
};

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
        onNodeEdit,
        deleteTab,
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
            const definition = fakeDefinitions[result.source.index];
            sandboxManager.addNode(
                definitionToNode(definition, sandboxManager.mousePos)
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
                tabControls={<GraphControls />}
                tabTemplate={tab => (
                    <TabTemplate {...tab} deleteTab={deleteTab} />
                )}
            />
            <DragDropContext
                onDragEnd={(result, provided) =>
                    dragEndObservable.execute({ result, provided })
                }
            >
                <div className="graph-content">
                    <VerticalCollapsible
                        width="300px"
                        minWidth="0"
                        onTabClick={toggleNodeSelect}
                        tabContent="Nodes"
                        collapsed={nodeSelectClosed}
                    >
                        <NodeSelect
                            dragStyle={nodeDragStyle}
                            definitions={fakeDefinitions}
                        />
                    </VerticalCollapsible>
                    <SandboxCanvas
                        editNode={onNodeEdit}
                        getDrawLinkRef={fakeLink.getElementRef}
                        isDrawing={isDrawing}
                        linkType={fakeLink.type}
                        links={links}
                        sandboxManager={sandboxManager}
                        nodes={nodes}
                        visibleLinks={linksVisible}
                    />
                    <VerticalCollapsible
                        width="450px"
                        minWidth="0"
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
