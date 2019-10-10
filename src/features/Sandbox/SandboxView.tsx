import { Button, Dropdown, Icon, Menu, Modal } from 'antd';
import classNames from 'classnames';
import { CustomCollapsible, FlexFillGreedy, FlexRow } from 'components';
import { DraggableTabs, ITab } from 'components/DraggableTabs';
import GraphModalFormController from 'components/Modals/GraphModal/GraphModalForm';
import MacroModalFormController from 'components/Modals/MacroModal/MacroModalForm';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Prompt } from 'react-router';
import { DragEndProps, SandboxStore, useStore } from 'stores';
import { isMacro } from 'utils';
import { LogView } from './LogView';
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
        <div
            className={classNames({ tab: true, dragging: isDragging })}
            onMouseDown={event =>
                middleDelete(event.nativeEvent, () => deleteTab(id))
            }
        >
            <span className="tab-title">{name}</span>
            <span className="tab-close" onMouseDown={() => deleteTab(id)}>
                <Icon type="close" />
            </span>
        </div>
    );
};

interface IBridgeMenuProps {
    bridges?: IBridgeInfo[];
    currentBridge?: IBridgeInfo;
    onSelect: (bridge: IBridgeInfo) => void;
    refresh: () => void;
}

const BridgeMenu: React.FC<IBridgeMenuProps> = ({
    bridges,
    currentBridge,
    onSelect,
    refresh,
}) => (
    <Menu>
        {bridges &&
            bridges.map(b => (
                <Menu.Item
                    key={b.deviceIdentifier}
                    onMouseDown={() => onSelect(b)}
                    disabled={
                        currentBridge &&
                        b.deviceIdentifier === currentBridge.deviceIdentifier
                    }
                >
                    {b.deviceName}
                </Menu.Item>
            ))}
        {!bridges && <Menu.Item disabled>No Bridges</Menu.Item>}
        <Menu.Divider />
        <Menu.Item onMouseDown={() => refresh()}>
            <Icon type="sync" />
            Refresh Bridges
        </Menu.Item>
    </Menu>
);

interface ISandboxHeaderProps {
    canSave: boolean;
    isSaving: boolean;
    canEdit: boolean;
    sandboxStore: SandboxStore;
    canRun: boolean;
    isRunning: boolean;
    canSelectBridge: boolean;
    isBridgeLoading: boolean;
    editGraph: (graph: Graph | Macro | undefined) => void;
}

const SandboxHeader: React.FC<ISandboxHeaderProps> = ({
    canSave,
    isSaving,
    canEdit,
    canRun,
    isRunning,
    canSelectBridge,
    isBridgeLoading,
    sandboxStore,
    editGraph,
}) => (
    <FlexRow className="sandbox-header" flex="0 1 auto">
        <FlexRow gap={5}>
            <Button
                disabled={!canSave}
                shape="round"
                type="primary"
                icon="save"
                loading={isSaving}
                onClick={() => sandboxStore.saveGraph()}
            >
                Save
            </Button>
            <Button
                disabled={!canEdit}
                shape="round"
                type="primary"
                icon="setting"
                onClick={() => editGraph(sandboxStore.tabManager.activeGraph!)}
            >
                Edit Graph
            </Button>
        </FlexRow>
        <FlexFillGreedy />
        <FlexRow gap={5}>
            <Button
                type="primary"
                shape="round"
                icon="caret-right"
                disabled={!canRun}
                onMouseDown={() => sandboxStore.runGraph()}
                loading={isRunning}
            >
                Run
            </Button>
            <Dropdown
                disabled={!canSelectBridge}
                trigger={['click']}
                overlay={
                    <BridgeMenu
                        onSelect={sandboxStore.onBridgeSelect}
                        bridges={sandboxStore.hubStates.graph.bridges}
                        currentBridge={sandboxStore.sandboxState.currentBridge}
                        refresh={sandboxStore.refreshBridges}
                    />
                }
            >
                <Button
                    type="primary"
                    shape="round"
                    icon="deployment-unit"
                    loading={isBridgeLoading}
                >
                    {!sandboxStore.sandboxState.currentBridge
                        ? 'Bridge(s)'
                        : sandboxStore.sandboxState.currentBridge.deviceName}
                    <Icon type="down" />
                </Button>
            </Dropdown>
        </FlexRow>
    </FlexRow>
);

const dragContextOnDragEnd = (
    { result }: DragEndProps,
    sandboxStore: SandboxStore,
    addNode: (definition: NodeDefinition, position?: Vector2) => void
) => {
    if (!sandboxStore.tabManager.hasActiveTab || !result.destination) {
        return;
    }

    if (
        result.source.droppableId.startsWith(nodeSelectDroppableId) &&
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
};

export const SandboxView = observer(() => {
    const { sandboxStore, graphModalStore, macroModalStore } = useStore();

    useEffect(() => {
        if (!sandboxStore.tabManager.hasTabs) {
            sandboxStore.toggleModalState('selectionModal', true);
        }

        sandboxStore.dragEndObservable.subscribe(result =>
            dragContextOnDragEnd(result, sandboxStore, addNode)
        );
        sandboxStore.setSandboxActive(true);
        return () => {
            sandboxStore.dispose();
            sandboxStore.setSandboxActive(false);
        };
    }, [sandboxStore]);

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

    function editGraph(graph: Graph | Macro) {
        sandboxStore.toggleSandboxState('isEditingSettings', true);
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
        sandboxStore.toggleSandboxState('isEditingSettings', false);
    };

    function onGraphEditModalCancel() {
        if (!sandboxStore.sandboxState.isEditingSettings) {
            sandboxStore.toggleModalState('selectionModal', true);
        } else {
            sandboxStore.toggleSandboxState('isEditingSettings', false);
        }
    }

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
                    <SandboxHeader
                        canSave={sandboxStore.tabManager.hasActiveTab}
                        isSaving={sandboxStore.sandboxState.savingGraph}
                        canEdit={sandboxStore.tabManager.hasActiveTab}
                        canRun={sandboxStore.canRun}
                        isRunning={
                            sandboxStore.isLoading ||
                            !!sandboxStore.hubStates.graph.running
                        }
                        canSelectBridge={sandboxStore.canSelectBridge}
                        isBridgeLoading={sandboxStore.isLoading}
                        editGraph={editGraph}
                        sandboxStore={sandboxStore}
                    />
                    <div className="graph-content">
                        <CustomCollapsible
                            size="15vw"
                            minSize="325px"
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
                                toggleConsole={() => {
                                    sandboxStore.logManager.markAllAsRead();
                                    sandboxStore.toggleViewState('logs');
                                }}
                                canToggleConsole={!sandboxStore.areLogsEnabled}
                                isConsoleLoading={
                                    sandboxStore.areLogsConnecting
                                }
                                unreadLogCount={
                                    sandboxStore.logManager.unreadLogCount
                                }
                            />
                        </div>
                        <CustomCollapsible
                            size="18vw"
                            minSize="325px"
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

            <GraphModalFormController
                onSave={onGraphEdit}
                onGoBack={onGraphEditModalCancel}
            />
            <MacroModalFormController
                onSave={onGraphEdit}
                onGoBack={onGraphEditModalCancel}
            />
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
                footer={
                    <Button
                        onMouseDown={() => {
                            sandboxStore.toggleModalState('selectGraph', false);
                            sandboxStore.toggleModalState(
                                'selectionModal',
                                true
                            );
                        }}
                        icon="left"
                    >
                        Go Back
                    </Button>
                }
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
            <Modal
                className="sandbox-modal log-view-modal"
                title="Console"
                maskClosable
                visible={sandboxStore.viewStates.logs}
                style={{ minHeight: '80vh', maxHeight: '80vh' }}
                footer={null}
                onCancel={() => sandboxStore.toggleViewState('logs', false)}
                centered
            >
                <LogView
                    logs={sandboxStore.logManager.activeTabLogs}
                    clearLogs={sandboxStore.logManager.clearLogs}
                />
            </Modal>
            {/* <Prompt
                when={sandboxStore.sandboxManager.isDirty}
                message="You have some unsaved changes. Are you sure you want to leave?"
            /> */}
        </>
    );
});