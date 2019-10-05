import { Badge, Button, Dropdown, Icon, Menu, Modal, Tooltip } from 'antd';
import classNames from 'classnames';
import { CustomCollapsible, FlexFillGreedy, FlexRow, XTerm } from 'components';
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

interface IBridgeMenuProps {
    bridges?: IBridgeInfo[];
    onSelect: (bridge: IBridgeInfo) => void;
    refresh: () => void;
}

const BridgeMenu: React.FC<IBridgeMenuProps> = ({
    bridges,
    onSelect,
    refresh,
}) => (
    <Menu>
        {bridges &&
            bridges.map(b => (
                <Menu.Item
                    key={b.deviceIdentifier}
                    onMouseDown={() => onSelect(b)}
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
                    <FlexRow className="sandbox-header" flex="0 1 auto">
                        <FlexRow gap={5}>
                            <Button
                                disabled={!sandboxStore.tabManager.hasActiveTab}
                                shape="round"
                                type="primary"
                                icon="save"
                                loading={sandboxStore.sandboxState.savingGraph}
                                onClick={() => sandboxStore.saveGraph()}
                            >
                                Save
                            </Button>
                            <Button
                                disabled={!sandboxStore.tabManager.hasActiveTab}
                                shape="round"
                                type="primary"
                                icon="setting"
                                onClick={() =>
                                    editGraph(
                                        sandboxStore.tabManager.activeGraph!
                                    )
                                }
                            >
                                Edit Graph
                            </Button>
                        </FlexRow>
                        <FlexFillGreedy />
                        <FlexRow gap={5}>
                            <Badge
                                count={sandboxStore.logManager.unreadLogCount}
                            >
                                <Button
                                    disabled={!sandboxStore.areLogsEnabled}
                                    shape="round"
                                    type="primary"
                                    icon="code"
                                    loading={sandboxStore.areLogsConnecting}
                                    onClick={() =>
                                        sandboxStore.toggleViewState('logs')
                                    }
                                >
                                    Logs
                                </Button>
                            </Badge>
                            <Dropdown
                                disabled={!sandboxStore.canSelectBridge}
                                trigger={['click']}
                                overlay={
                                    <BridgeMenu
                                        onSelect={sandboxStore.onBridgeSelect}
                                        bridges={
                                            sandboxStore.hubStates.graph.bridges
                                        }
                                        refresh={sandboxStore.refreshBridges}
                                    />
                                }
                            >
                                <Button
                                    type="primary"
                                    shape="round"
                                    icon="deployment-unit"
                                    disabled={!sandboxStore.canSelectBridge}
                                    loading={sandboxStore.isLoading}
                                >
                                    {!sandboxStore.sandboxState.currentBridge
                                        ? 'Bridge(s)'
                                        : sandboxStore.sandboxState
                                              .currentBridge.deviceName}
                                    <Icon type="down" />
                                </Button>
                            </Dropdown>
                            <Button
                                type="primary"
                                shape="round"
                                icon="caret-right"
                                disabled={!sandboxStore.canRun}
                                onMouseDown={() => sandboxStore.runGraph()}
                                loading={
                                    sandboxStore.isLoading ||
                                    sandboxStore.hubStates.graph.running
                                }
                            >
                                Run
                            </Button>
                        </FlexRow>
                    </FlexRow>
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
                            />

                            <CustomCollapsible
                                className="log-section"
                                collapsed={!sandboxStore.viewStates.logs}
                                size="25vh"
                                direction="top"
                            >
                                <XTerm
                                    getRef={sandboxStore.logManager.setXterm}
                                />
                            </CustomCollapsible>
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
                onGoBack={() => {
                    sandboxStore.toggleModalState('selectionModal', true);
                }}
            />
            <MacroModalFormController
                onSave={onGraphEdit}
                onGoBack={() => {
                    sandboxStore.toggleModalState('selectionModal', true);
                }}
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
        </>
    );
});
