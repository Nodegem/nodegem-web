import { Button, Dropdown, Icon, Menu, Modal } from 'antd';
import classNames from 'classnames';
import { FlexColumn, FlexFillGreedy, FlexRow } from 'components';
import { DraggableTabs, ITab } from 'components/DraggableTabs';
import GraphModalFormController from 'components/Modals/GraphModal/GraphModalForm';
import MacroModalFormController from 'components/Modals/MacroModal/MacroModalForm';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useStore } from 'stores';
import { Provider, Subscribe } from 'unstated-typescript';
import { isMacro } from 'utils';
import { GraphTabsSection } from './GraphTabsSection';
import { LogView } from './LogView';
import { DragEndProps, SandboxStore } from './managers/sandbox-store';
import { NodeInfoSection } from './NodeInfoSection';
import { nodeSelectDroppableId } from './NodeSelect/NodeSelect';
import { NodeSelectSection } from './NodeSelectSection';
import PromptGraph from './PromptGraph/PromptGraph';
import SelectGraph from './PromptGraph/SelectGraph';
import { sandboxDroppableId } from './Sandbox/SandboxCanvas';

import { SandboxContainer } from './containers/sandbox-container';
import './SandboxView.less';

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
    <Menu theme="dark">
        {bridges &&
            bridges.map(b => (
                <Menu.Item
                    key={b.deviceIdentifier}
                    onClick={() => onSelect(b)}
                    disabled={
                        currentBridge &&
                        b.deviceIdentifier === currentBridge.deviceIdentifier
                    }
                >
                    {b.deviceName}
                </Menu.Item>
            ))}
        {!bridges && (
            <Menu.Item key="none" disabled>
                No Bridges
            </Menu.Item>
        )}
        <Menu.Divider />
        <Menu.Item key="refresh" onClick={() => refresh()}>
            <Icon type="sync" />
            Refresh Bridges
        </Menu.Item>
    </Menu>
);

interface ISandboxHeaderProps {
    sandboxStore: SandboxStore;
    canSave: boolean;
    isSaving: boolean;
    canEdit: boolean;
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
                overlay={
                    <BridgeMenu
                        onSelect={sandboxStore.onBridgeSelect}
                        bridges={sandboxStore.stateManager.bridges}
                        currentBridge={
                            sandboxStore.stateManager.hasBridges
                                ? sandboxStore.stateManager.activeBridge
                                : undefined
                        }
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
                    {!sandboxStore.stateManager.hasActiveBridge
                        ? 'Bridge(s)'
                        : sandboxStore.stateManager.activeBridge.deviceName}
                    <Icon type="down" />
                </Button>
            </Dropdown>
        </FlexRow>
    </FlexRow>
);

const dragContextOnDragEnd = (
    { result }: DragEndProps,
    sandboxStore: SandboxStore
) => {
    if (!sandboxStore.tabManager.hasActiveTab || !result.destination) {
        return;
    }

    if (
        result.source.droppableId.startsWith(nodeSelectDroppableId) &&
        result.destination.droppableId === sandboxDroppableId
    ) {
        sandboxStore.addNode(result.draggableId);
    }
};

const SandboxComponent: React.FC = () => {
    // useEffect(() => {
    //     toggleActive(true);
    //     nodeSelect.toggle(true);
    //     return () => {
    //         toggleActive(false);
    //     };
    // }, [isActive]);

    return (
        <DragDropContext onDragEnd={(result, provided) => {}}>
            <FlexRow className="graph-content">
                <NodeSelectSection />
                <FlexColumn flex="1 1 0%" style={{ minWidth: 0 }}>
                    <GraphTabsSection />
                    {/* <SandboxCanvas
                        loading={
                            sandboxStore.stateManager.sandboxState.loadingGraph
                        }
                        onFilter={text =>
                            sandboxStore.searchManager.setNodeSearchText(text)
                        }
                        isActive={sandboxStore.tabManager.hasActiveTab}
                        editNode={sandboxStore.onNodeEdit}
                        getDrawLinkRef={
                            sandboxStore.drawLinkManager.fakeLink.getElementRef
                        }
                        isDrawing={sandboxStore.drawLinkManager.isDrawing}
                        linkType={sandboxStore.drawLinkManager.fakeLink.type}
                        links={sandboxStore.sandboxManager.links}
                        sandboxManager={sandboxStore.sandboxManager}
                        nodes={sandboxStore.sandboxManager.nodes}
                        visibleLinks={
                            sandboxStore.stateManager.sandboxState.linksVisible
                        }
                        toggleConsole={() => {
                            sandboxStore.logManager.markAllAsRead();
                            sandboxStore.stateManager.toggleViewState('logs');
                        }}
                        canToggleConsole={!sandboxStore.areLogsEnabled}
                        isConsoleLoading={
                            sandboxStore.hubManager.isTerminalConnecting
                        }
                        unreadLogCount={sandboxStore.logManager.unreadLogCount}
                    /> */}
                </FlexColumn>
                <NodeInfoSection />
            </FlexRow>
        </DragDropContext>
    );
};

let sandboxContainer = new SandboxContainer();

export const SandboxView = () => {
    useEffect(() => {
        sandboxContainer = new SandboxContainer();
        return () => {};
    }, []);

    function handleTabClick(tabId: string) {
        // sandboxStore.tabManager.setActiveTab(tabId);
    }

    function handleTabReorder(orderedTabs: any[]) {
        // sandboxStore.tabManager.setTabs(orderedTabs.map(x => x.data));
    }

    function editGraph(graph: Graph | Macro) {
        // sandboxStore.stateManager.updateSandboxState('isEditingSettings', true);
        // if (isMacro(graph)) {
        //     macroModalStore.openModal(graph, true);
        // } else {
        //     graphModalStore.openModal(graph, true);
        // }
    }

    function handleGraphCreate(type: GraphType) {
        // sandboxStore.stateManager.updateModalState('initialPrompt', false);
        // if (type === 'graph') {
        //     graphModalStore.openModal({ isActive: true });
        // } else {
        //     macroModalStore.openModal();
        // }
    }

    function onGraphSelect() {
        // sandboxStore.stateManager.updateModalState('initialPrompt', false);
        // sandboxStore.stateManager.updateModalState('select', true);
    }

    const onGraphEdit = (graph?: Graph | Macro, edit?: boolean) => {
        // if (graph) {
        //     if (!edit) {
        //         sandboxStore.tabManager.addTab(graph);
        //     } else {
        //         sandboxStore.tabManager.editTab(graph);
        //     }
        // }
        // sandboxStore.stateManager.updateSandboxState(
        //     'isEditingSettings',
        //     false
        // );
    };

    function onGraphEditModalCancel() {
        // if (!sandboxStore.stateManager.sandboxState.isEditingSettings) {
        //     sandboxStore.stateManager.updateModalState('initialPrompt', true);
        // } else {
        //     sandboxStore.stateManager.updateSandboxState(
        //         'isEditingSettings',
        //         false
        //     );
        // }
    }

    return (
        <Provider inject={[sandboxContainer]}>
            <Subscribe to={[SandboxContainer]}>
                {container => (
                    <FlexRow className="sandbox-view-container">
                        <SandboxComponent />
                    </FlexRow>
                )}
            </Subscribe>
        </Provider>
    );
};

// /* <div className="sandbox-view-container">
//                 <DragDropContext
//                     onDragEnd={(result, provided) => {
//                         sandboxStore.dragEndObservable.execute({
//                             result,
//                             provided,
//                         });
//                     }}
//                 >
//                     <SandboxHeader
//                         canSave={sandboxStore.tabManager.hasActiveTab}
//                         isSaving={
//                             sandboxStore.stateManager.sandboxState.savingGraph
//                         }
//                         canEdit={sandboxStore.tabManager.hasActiveTab}
//                         canRun={sandboxStore.canRun}
//                         isRunning={
//                             sandboxStore.isLoading ||
//                             sandboxStore.stateManager.sandboxState
//                                 .isGraphRunning
//                         }
//                         canSelectBridge={sandboxStore.canSelectBridge}
//                         isBridgeLoading={sandboxStore.isLoading}
//                         editGraph={editGraph}
//                         sandboxStore={sandboxStore}
//                     />
//                     <div className="graph-content">
//                         <CustomCollapsible
//                             size="15vw"
//                             minSize="325px"
//                             onTabClick={() =>
//                                 sandboxStore.stateManager.toggleViewState(
//                                     'nodeSelect'
//                                 )
//                             }
//                             tabContent="Nodes"
//                             collapsed={
//                                 !sandboxStore.stateManager.viewState.nodeSelect
//                             }
//                         >
//                             <NodeSelect
//                                 onFilter={text =>
//                                     sandboxStore.searchManager.setNodeOptionSearchtext(
//                                         text
//                                     )
//                                 }
//                                 addNode={node =>
//                                     sandboxStore.addNode(node.fullName)
//                                 }
//                                 loading={
//                                     sandboxStore.stateManager.sandboxState
//                                         .loadingDefinitions
//                                 }
//                                 nodeOptions={
//                                     sandboxStore.stateManager.nodeDefinitions &&
//                                     sandboxStore.stateManager.nodeDefinitions
//                                         .selectFriendly
//                                 }
//                             />
//                         </CustomCollapsible>
//                         <div
//                             style={{
//                                 flex: '1 1 0%',
//                                 display: 'flex',
//                                 flexDirection: 'column',
//                                 minWidth: 0,
//                             }}
//                         >
//                             <FlexRow className="graph-tabs" flex="0 1 auto">
//                                 <DraggableTabs
//                                     tabs={sandboxStore.tabManager.tabs.map(
//                                         t => ({
//                                             id: t.graph.id!,
//                                             name: t.graph.name!,
//                                             data: t,
//                                         })
//                                     )}
//                                     activeTab={
//                                         sandboxStore.tabManager.activeTab &&
//                                         sandboxStore.tabManager.activeTab.graph
//                                             .id
//                                     }
//                                     onTabReorder={handleTabReorder}
//                                     dragEndObservable={
//                                         sandboxStore.dragEndObservable
//                                     }
//                                     onTabAdd={() =>
//                                         sandboxStore.stateManager.toggleModalState(
//                                             'initialPrompt'
//                                         )
//                                     }
//                                     onTabClick={handleTabClick}
//                                     tabTemplate={(tab, isDragging) => (
//                                         <TabTemplate
//                                             {...tab}
//                                             isDragging={isDragging}
//                                             deleteTab={
//                                                 sandboxStore.tabManager
//                                                     .deleteTab
//                                             }
//                                         />
//                                     )}
//                                 />
//                             </FlexRow>
//                             <SandboxCanvas
//                                 loading={
//                                     sandboxStore.stateManager.sandboxState
//                                         .loadingGraph
//                                 }
//                                 onFilter={text =>
//                                     sandboxStore.searchManager.setNodeSearchText(
//                                         text
//                                     )
//                                 }
//                                 isActive={sandboxStore.tabManager.hasActiveTab}
//                                 editNode={sandboxStore.onNodeEdit}
//                                 getDrawLinkRef={
//                                     sandboxStore.drawLinkManager.fakeLink
//                                         .getElementRef
//                                 }
//                                 isDrawing={
//                                     sandboxStore.drawLinkManager.isDrawing
//                                 }
//                                 linkType={
//                                     sandboxStore.drawLinkManager.fakeLink.type
//                                 }
//                                 links={sandboxStore.sandboxManager.links}
//                                 sandboxManager={sandboxStore.sandboxManager}
//                                 nodes={sandboxStore.sandboxManager.nodes}
//                                 visibleLinks={
//                                     sandboxStore.stateManager.sandboxState
//                                         .linksVisible
//                                 }
//                                 toggleConsole={() => {
//                                     sandboxStore.logManager.markAllAsRead();
//                                     sandboxStore.stateManager.toggleViewState(
//                                         'logs'
//                                     );
//                                 }}
//                                 canToggleConsole={!sandboxStore.areLogsEnabled}
//                                 isConsoleLoading={
//                                     sandboxStore.hubManager.isTerminalConnecting
//                                 }
//                                 unreadLogCount={
//                                     sandboxStore.logManager.unreadLogCount
//                                 }
//                             />
//                         </div>
//                         <CustomCollapsible
//                             size="18vw"
//                             minSize="325px"
//                             onTabClick={() =>
//                                 sandboxStore.stateManager.toggleViewState(
//                                     'nodeInfo'
//                                 )
//                             }
//                             direction="left"
//                             tabContent="Node Info"
//                             collapsed={
//                                 !sandboxStore.stateManager.viewState.nodeInfo
//                             }
//                         >
//                             <NodeInfo
//                                 selectedNode={
//                                     sandboxStore.sandboxManager
//                                         .firstSelectedNode
//                                 }
//                                 onNodeValueChange={(n, f) =>
//                                     n.updatePortValues(f)
//                                 }
//                             />
//                         </CustomCollapsible>
//                     </div>
//                 </DragDropContext>
//             </div> */}

//                 {/* <GraphModalFormController
//                 onSave={onGraphEdit}
//                 onGoBack={onGraphEditModalCancel}
//             />
//             <MacroModalFormController
//                 onSave={onGraphEdit}
//                 onGoBack={onGraphEditModalCancel}
//             />
//             <Modal
//                 className="sandbox-modal prompt-graph-modal"
//                 maskClosable={sandboxStore.tabManager.hasTabs}
//                 visible={sandboxStore.stateManager.modalState.initialPrompt}
//                 footer={null}
//                 onCancel={() =>
//                     sandboxStore.stateManager.updateModalState(
//                         'initialPrompt',
//                         false
//                     )
//                 }
//                 centered
//                 closable={sandboxStore.tabManager.hasActiveTab}
//             >
//                 <PromptGraph
//                     onSelectGraph={onGraphSelect}
//                     onTypeSelect={handleGraphCreate}
//                 />
//             </Modal>
//             <Modal
//                 className="sandbox-modal select-graph-modal"
//                 title="Select Graph or Macro"
//                 maskClosable={sandboxStore.tabManager.hasTabs}
//                 visible={sandboxStore.stateManager.modalState.select}
//                 footer={
//                     <Button
//                         onMouseDown={() => {
//                             sandboxStore.stateManager.updateModalState(
//                                 'select',
//                                 false
//                             );
//                             sandboxStore.stateManager.updateModalState(
//                                 'initialPrompt',
//                                 true
//                             );
//                         }}
//                         icon="left"
//                     >
//                         Go Back
//                     </Button>
//                 }
//                 onCancel={() =>
//                     sandboxStore.stateManager.updateModalState(
//                         'initialPrompt',
//                         false
//                     )
//                 }
//                 centered
//                 closable={sandboxStore.tabManager.hasActiveTab}
//             >
//                 <SelectGraph
//                     onGraphSelect={g => {
//                         sandboxStore.stateManager.updateModalState(
//                             'select',
//                             false
//                         );
//                         sandboxStore.tabManager.addTab(g);
//                     }}
//                 />
//             </Modal>
//             <Modal
//                 className="sandbox-modal log-view-modal"
//                 title="Console"
//                 maskClosable
//                 visible={sandboxStore.stateManager.viewState.logs}
//                 style={{ minHeight: '80vh', maxHeight: '80vh' }}
//                 footer={null}
//                 onCancel={() =>
//                     sandboxStore.stateManager.updateViewState('logs', false)
//                 }
//                 centered
//             >
//                 <LogView
//                     logs={sandboxStore.logManager.activeTabLogs}
//                     clearLogs={sandboxStore.logManager.clearLogs}
//                 />
//             </Modal> */}
//                 {/* <Prompt
//                 when={sandboxStore.sandboxManager.isDirty}
//                 message="You have some unsaved changes. Are you sure you want to leave?"
//             /> */}
