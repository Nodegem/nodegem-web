import { Badge, Button, Dropdown, Icon, Modal, Tooltip } from 'antd';
import classNames from 'classnames';
import { CustomCollapsible, FlexRow } from 'components';
import { DraggableTabs, ITab } from 'components/DraggableTabs';
import GraphModalFormController from 'components/Modals/GraphModal/GraphModalForm';
import MacroModalFormController from 'components/Modals/MacroModal/MacroModalForm';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { DragEndProps, useStore } from 'stores';
import { isMacro } from 'utils';
import NodeInfo from './NodeInfo/NodeInfo';
import { NodeSelect, nodeSelectDroppableId } from './NodeSelect/NodeSelect';
import PromptGraph from './PromptGraph/PromptGraph';
import SelectGraph from './PromptGraph/SelectGraph';
import { SandboxCanvas, sandboxDroppableId } from './Sandbox/SandboxCanvas';
import './SandboxView.less';
import { definitionToNode } from './utils';

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
            mouseEnterDelay={0.25}
            title={
                <Button
                    size="small"
                    type="danger"
                    icon="delete"
                    onMouseDown={() => deleteTab(id)}
                />
            }
        >
            <div
                className={classNames({ tab: true, dragging: isDragging })}
                onMouseDown={event =>
                    middleDelete(event.nativeEvent, () => deleteTab(id))
                }
            >
                <span className="tab-title">{name}</span>
            </div>
        </Tooltip>
    );
};

interface IGraphControlProps {
    graph?: Partial<Graph | Macro>;
    unreadLogs: number;
    openModal: (graph: Partial<Graph | Macro>) => void;
    toggleLogs: () => void;
    runGraph: () => void;
    saveGraph: () => void;
    saving?: boolean;
    graphState: {
        connecting?: boolean;
        connected?: boolean;
        running?: boolean;
    };
    terminalState: { connecting?: boolean; connected?: boolean };
}
const GraphControls: React.FC<IGraphControlProps> = ({
    graph,
    unreadLogs,
    openModal,
    toggleLogs,
    runGraph,
    saveGraph,
    saving,
    graphState,
    terminalState,
}) => {
    return (
        <div className="tab-controls">
            <Button
                disabled={!graph || !graphState.connected}
                shape="round"
                type="primary"
                icon="play-circle"
                size="large"
                onClick={() => runGraph()}
                loading={graphState.connecting || graphState.running}
            >
                Run
            </Button>
            <Tooltip title="Console">
                <Badge count={unreadLogs}>
                    <Button
                        disabled={!graph || !terminalState.connected}
                        shape="circle"
                        type="primary"
                        icon="code"
                        size="large"
                        loading={terminalState.connecting}
                        onClick={() => toggleLogs()}
                    />
                </Badge>
            </Tooltip>
            <Tooltip title="Settings">
                <Button
                    disabled={!graph}
                    shape="circle"
                    type="primary"
                    icon="setting"
                    size="large"
                    onClick={() => openModal(graph!)}
                />
            </Tooltip>
            <Tooltip title="Save">
                <Button
                    disabled={!graph}
                    shape="circle"
                    type="primary"
                    icon="save"
                    size="large"
                    loading={saving}
                    onClick={() => saveGraph()}
                />
            </Tooltip>
        </div>
    );
};

export const SandboxView = observer(() => {
    const { sandboxStore, graphModalStore, macroModalStore } = useStore();

    useEffect(() => {
        if (!sandboxStore.tabManager.hasTabs) {
            sandboxStore.toggleModalState('selectionModal', true);
        }

        sandboxStore.dragEndObservable.subscribe(onDragEnd);
        sandboxStore.setSandboxActive(true);
        return () => {
            sandboxStore.dispose();
            sandboxStore.setSandboxActive(false);
        };
    }, [sandboxStore]);

    function onDragEnd({ result }: DragEndProps) {
        if (!sandboxStore.tabManager.hasActiveTab || !result.destination) {
            return;
        }

        if (
            result.source.droppableId === nodeSelectDroppableId &&
            result.destination.droppableId === sandboxDroppableId
        ) {
            const definition =
                sandboxStore.nodeDefinitionCache.definitionLookup[
                    result.draggableId
                ];

            if (definition) {
                addNode(definition, sandboxStore.sandboxManager.mousePos);
            }
        }
    }

    const addNode = (definition: NodeDefinition, position?: Vector2) => {
        sandboxStore.sandboxManager.addNode(
            definitionToNode(definition, position || { x: 0, y: 0 })
        );
    };

    function handleTabClick(tabId: string, data: TabData) {
        sandboxStore.tabManager.setActiveTab(tabId);
    }

    function handleTabReorder(orderedTabs: any[]) {
        sandboxStore.tabManager.setTabs(orderedTabs.map(x => x.data));
    }

    function editGraph(graph: Partial<Graph | Macro>) {
        if (isMacro(graph)) {
            macroModalStore.openModal(graph, true);
        } else {
            graphModalStore.openModal(graph, true);
        }
    }

    function handleGraphCreate(type: GraphType) {
        sandboxStore.toggleModalState('selectionModal', false);
        if (type === 'graph') {
            graphModalStore.openModal({ isActive: true });
        } else {
            macroModalStore.openModal();
        }
    }

    function onGraphSelect() {
        sandboxStore.toggleModalState('selectionModal', false);
        sandboxStore.toggleModalState('selectGraph', true);
    }

    const onGraphEdit = (graph?: Graph | Macro, edit?: boolean) => {
        if (graph) {
            if (!edit) {
                sandboxStore.tabManager.addTab(graph);
            } else {
                sandboxStore.tabManager.editTab(graph);
            }
        }
    };

    return (
        <>
            <div className="sandbox-view-container">
                <DragDropContext
                    onDragEnd={(result, provided) => {
                        sandboxStore.dragEndObservable.execute({
                            result,
                            provided,
                        });
                    }}
                >
                    <FlexRow
                        className="sandbox-header"
                        flex="0 1 auto"
                        justifyContent="end"
                    >
                        <Dropdown overlay={null}>
                            <Button
                                type="primary"
                                size="large"
                                shape="round"
                                icon="caret-right"
                            >
                                Run
                            </Button>
                        </Dropdown>
                        <Dropdown overlay={null}>
                            <Button
                                type="primary"
                                size="large"
                                shape="round"
                                icon="deployment-unit"
                            >
                                Bridge(s)
                                <Icon type="down" />
                            </Button>
                        </Dropdown>
                    </FlexRow>
                    <div className="graph-content">
                        <CustomCollapsible
                            size="15vw"
                            onTabClick={() =>
                                sandboxStore.toggleViewState('nodeSelect')
                            }
                            tabContent="Nodes"
                            collapsed={!sandboxStore.viewStates.nodeSelect}
                        >
                            <NodeSelect
                                onFilter={text =>
                                    sandboxStore.searchManager.setNodeOptionSearchtext(
                                        text
                                    )
                                }
                                addNode={node => addNode(node)}
                                loading={
                                    sandboxStore.sandboxState.loadingDefinitions
                                }
                                nodeOptions={
                                    sandboxStore.nodeDefinitionCache &&
                                    sandboxStore.nodeDefinitionCache
                                        .selectFriendly
                                }
                            />
                        </CustomCollapsible>
                        <div
                            style={{
                                flex: '1 1 0%',
                                display: 'flex',
                                flexDirection: 'column',
                                minWidth: 0,
                            }}
                        >
                            <FlexRow className="graph-tabs" flex="0 1 auto">
                                <DraggableTabs
                                    tabs={sandboxStore.tabManager.tabs.map(
                                        t => ({
                                            id: t.graph.id!,
                                            name: t.graph.name!,
                                            data: t,
                                        })
                                    )}
                                    activeTab={
                                        sandboxStore.tabManager.activeTab &&
                                        sandboxStore.tabManager.activeTab.graph
                                            .id
                                    }
                                    onTabReorder={handleTabReorder}
                                    dragEndObservable={
                                        sandboxStore.dragEndObservable
                                    }
                                    onTabAdd={() =>
                                        sandboxStore.toggleModalState(
                                            'selectionModal'
                                        )
                                    }
                                    onTabClick={handleTabClick}
                                    tabTemplate={(tab, isDragging) => (
                                        <TabTemplate
                                            {...tab}
                                            isDragging={isDragging}
                                            deleteTab={
                                                sandboxStore.tabManager
                                                    .deleteTab
                                            }
                                        />
                                    )}
                                />
                            </FlexRow>
                            <SandboxCanvas
                                loading={sandboxStore.sandboxState.loadingGraph}
                                onFilter={text =>
                                    sandboxStore.searchManager.setNodeSearchText(
                                        text
                                    )
                                }
                                isActive={sandboxStore.tabManager.hasActiveTab}
                                editNode={sandboxStore.onNodeEdit}
                                getDrawLinkRef={
                                    sandboxStore.drawLinkManager.fakeLink
                                        .getElementRef
                                }
                                isDrawing={
                                    sandboxStore.drawLinkManager.isDrawing
                                }
                                linkType={
                                    sandboxStore.drawLinkManager.fakeLink.type
                                }
                                links={sandboxStore.sandboxManager.links}
                                sandboxManager={sandboxStore.sandboxManager}
                                nodes={sandboxStore.sandboxManager.nodes}
                                visibleLinks={
                                    sandboxStore.sandboxState.linksVisible
                                }
                            />

                            <CustomCollapsible
                                className="log-section"
                                collapsed={!sandboxStore.viewStates.logs}
                                size="25vh"
                                direction="top"
                            >
                                Test
                            </CustomCollapsible>
                        </div>
                        <CustomCollapsible
                            size="18vw"
                            onTabClick={() =>
                                sandboxStore.toggleViewState('nodeInfo')
                            }
                            direction="left"
                            tabContent="Node Info"
                            collapsed={!sandboxStore.viewStates.nodeInfo}
                        >
                            <NodeInfo
                                selectedNode={
                                    sandboxStore.sandboxManager
                                        .firstSelectedNode
                                }
                                onNodeValueChange={(n, f) =>
                                    n.updatePortValues(f)
                                }
                            />
                        </CustomCollapsible>
                    </div>
                </DragDropContext>
            </div>

            <GraphModalFormController onSave={onGraphEdit} />
            <MacroModalFormController onSave={onGraphEdit} />
            <Modal
                className="sandbox-modal prompt-graph-modal"
                maskClosable={sandboxStore.tabManager.hasTabs}
                visible={sandboxStore.modalStates.selectionModal}
                footer={null}
                onCancel={() =>
                    sandboxStore.toggleModalState('selectionModal', false)
                }
                centered
                closable={sandboxStore.tabManager.hasActiveTab}
            >
                <PromptGraph
                    onSelectGraph={onGraphSelect}
                    onTypeSelect={handleGraphCreate}
                />
            </Modal>
            <Modal
                className="sandbox-modal select-graph-modal"
                title="Select Graph or Macro"
                maskClosable={sandboxStore.tabManager.hasTabs}
                visible={sandboxStore.modalStates.selectGraph}
                footer={null}
                onCancel={() =>
                    sandboxStore.toggleModalState('selectGraph', false)
                }
                centered
                closable={sandboxStore.tabManager.hasActiveTab}
            >
                <SelectGraph
                    onGraphSelect={g => {
                        sandboxStore.toggleModalState('selectGraph', false);
                        sandboxStore.tabManager.addTab(g);
                    }}
                />
            </Modal>
        </>
    );
});
