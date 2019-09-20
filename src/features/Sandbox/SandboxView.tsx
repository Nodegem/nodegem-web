import { Button, Modal, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import { DraggableTabs, ITab } from 'components/DraggableTabs';
import HorizontalCollapse from 'components/HorizontalCollapse/HorizontalCollapse';
import GraphModalFormController from 'components/Modals/GraphModal/GraphModalForm';
import MacroModalFormController from 'components/Modals/MacroModal/MacroModalForm';
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
import { DragEndProps, TabData, useStore } from 'stores';
import { isMacro } from 'utils';
import NodeInfo from './NodeInfo/NodeInfo';
import { NodeSelect, nodeSelectDroppableId } from './NodeSelect/NodeSelect';
import PromptGraph from './PromptGraph/PromptGraph';
import SelectGraph from './PromptGraph/SelectGraph';
import { SandboxCanvas, sandboxDroppableId } from './Sandbox/SandboxCanvas';
import './SandboxView.less';
import { definitionToNode } from './utils';

const { Paragraph } = Typography;

const middleDelete = (event: MouseEvent, deleteTab: () => void) => {
    if (event.button === 1) {
        event.preventDefault();
        event.stopPropagation();
        deleteTab();
    }
};

const TabTemplate: React.FC<
    ITab & { deleteTab: (tabId: string) => void; isDragging: boolean }
> = ({ name, id, isDragging, deleteTab }) => {
    return (
        <Tooltip
            placement="bottom"
            title={
                <Button
                    type="danger"
                    icon="delete"
                    onClick={() => deleteTab(id)}
                />
            }
        >
            <div
                className={classNames({ tab: true, dragging: isDragging })}
                onMouseDown={event =>
                    middleDelete(event.nativeEvent, () => deleteTab(id))
                }
            >
                <Paragraph
                    className="tab-title"
                    ellipsis={{ rows: 2, expandable: false }}
                >
                    {name}
                </Paragraph>
            </div>
        </Tooltip>
    );
};

interface IGraphControlProps {
    graph?: Partial<Graph | Macro>;
    openModal: (graph: Partial<Graph | Macro>) => void;
    toggleLogs: () => void;
}
const GraphControls: React.FC<IGraphControlProps> = ({
    graph,
    openModal,
    toggleLogs,
}) => {
    return (
        <div className="tab-controls">
            <Button
                disabled={!graph}
                shape="round"
                type="primary"
                icon="code"
                onClick={() => toggleLogs()}
            >
                Logs
            </Button>
            <Button
                disabled={!graph}
                shape="round"
                type="primary"
                icon="setting"
                onClick={() => openModal(graph!)}
            >
                Settings
            </Button>
            <Button
                disabled={!graph}
                shape="round"
                type="primary"
                icon="save"
                loading={false}
                onClick={() => {}}
            >
                Save
            </Button>
        </div>
    );
};

export const SandboxView = observer(() => {
    const { sandboxStore, graphModalStore, macroModalStore } = useStore();
    const {
        tabs,
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
        selectionModalVisible,
        toggleSelectionModal,
        selectGraphVisible,
        toggleGraphSelectModal,
        toggleLogs,
        logsClosed,
        nodeDefinitionOptions,
    } = sandboxStore;

    useEffect(() => {
        if (!sandboxStore.hasTabs) {
            toggleSelectionModal(true);
        }

        dragEndObservable.subscribe(onDragEnd);
        return () => {
            sandboxStore.dispose();
        };
    }, [sandboxStore]);

    function onDragEnd({ result }: DragEndProps) {
        if (!sandboxStore.hasActiveTab || !result.destination) {
            return;
        }

        if (
            result.source.droppableId === nodeSelectDroppableId &&
            result.destination.droppableId === sandboxDroppableId
        ) {
            const definition =
                sandboxStore.nodeDefinitionOptions.definitionLookup[
                    result.draggableId
                ];

            if (definition) {
                addNode(definition, sandboxManager.mousePos);
            }
        }
    }

    const addNode = (definition: NodeDefinition, position?: Vector2) => {
        sandboxManager.addNode(
            definitionToNode(definition, position || { x: 0, y: 0 })
        );
    };

    function handleTabClick(tabId: string, data: TabData) {
        setActiveTab(tabId);
    }

    function handleTabReorder(orderedTabs: any[]) {
        sandboxStore.setTabs(orderedTabs.map(x => x.data));
    }

    function editGraph(graph: Partial<Graph | Macro>) {
        if (isMacro(graph)) {
            macroModalStore.openModal(graph, true);
        } else {
            graphModalStore.openModal(graph, true);
        }
    }

    function handleGraphCreate(type: GraphType) {
        toggleSelectionModal();
        if (type === 'graph') {
            graphModalStore.openModal({ isActive: true });
        } else {
            macroModalStore.openModal();
        }
    }
    function onGraphSelect() {
        toggleSelectionModal();
        toggleGraphSelectModal();
    }

    return (
        <>
            <div className="sandbox-view-container">
                <DraggableTabs
                    tabs={tabs.map(t => ({
                        id: t.graph.id!,
                        name: t.graph.name!,
                        data: t,
                    }))}
                    activeTab={
                        sandboxStore.activeTab &&
                        sandboxStore.activeTab.graph.id
                    }
                    onTabReorder={handleTabReorder}
                    dragEndObservable={dragEndObservable}
                    onTabAdd={() => toggleSelectionModal()}
                    onTabClick={handleTabClick}
                    tabControls={
                        <GraphControls
                            graph={activeTab && activeTab.graph}
                            openModal={editGraph}
                            toggleLogs={toggleLogs}
                        />
                    }
                    tabTemplate={(tab, isDragging) => (
                        <TabTemplate
                            {...tab}
                            isDragging={isDragging}
                            deleteTab={deleteTab}
                        />
                    )}
                />
                <DragDropContext
                    onDragEnd={(result, provided) => {
                        dragEndObservable.execute({ result, provided });
                    }}
                >
                    <div className="graph-content">
                        <VerticalCollapsible
                            width="350px"
                            minWidth="0"
                            onTabClick={toggleNodeSelect}
                            tabContent="Nodes"
                            collapsed={nodeSelectClosed}
                        >
                            <NodeSelect
                                addNode={node => addNode(node)}
                                nodeOptions={
                                    nodeDefinitionOptions.selectFriendly
                                }
                            />
                        </VerticalCollapsible>
                        <div
                            style={{
                                flex: '1 1 auto',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <SandboxCanvas
                                isActive={sandboxStore.hasActiveTab}
                                editNode={onNodeEdit}
                                getDrawLinkRef={fakeLink.getElementRef}
                                isDrawing={isDrawing}
                                linkType={fakeLink.type}
                                links={links}
                                sandboxManager={sandboxManager}
                                nodes={nodes}
                                visibleLinks={linksVisible}
                            />

                            <HorizontalCollapse
                                collapsed={logsClosed}
                                height="25%"
                            >
                                das
                            </HorizontalCollapse>
                        </div>
                        <VerticalCollapsible
                            width="450px"
                            minWidth="0"
                            onTabClick={() => toggleNodeInfo()}
                            tabDirection="left"
                            tabContent="Node Info"
                            collapsed={nodeInfoClosed}
                        >
                            <NodeInfo
                                selectedNode={sandboxManager.firstSelectedNode}
                                onNodeValueChange={(n, f) =>
                                    n.updatePortValues(f)
                                }
                            />
                        </VerticalCollapsible>
                    </div>
                </DragDropContext>
            </div>

            <GraphModalFormController
                onSave={(graph, edit) =>
                    graph && !edit && sandboxStore.addTab(graph)
                }
            />
            <MacroModalFormController
                onSave={(macro, edit) =>
                    macro && !edit && sandboxStore.addTab(macro)
                }
            />
            <Modal
                maskClosable={sandboxStore.hasTabs}
                visible={selectionModalVisible}
                footer={null}
                onCancel={() => toggleSelectionModal()}
                width={700}
                centered
            >
                <PromptGraph
                    onSelectGraph={onGraphSelect}
                    onTypeSelect={handleGraphCreate}
                />
            </Modal>
            <Modal
                title="Select Graph or Macro"
                maskClosable={sandboxStore.hasTabs}
                visible={selectGraphVisible}
                footer={null}
                width={850}
                onCancel={() => toggleGraphSelectModal()}
                centered
            >
                <SelectGraph
                    onGraphSelect={g => {
                        toggleGraphSelectModal();
                        sandboxStore.addTab(g);
                    }}
                />
            </Modal>
        </>
    );
});
