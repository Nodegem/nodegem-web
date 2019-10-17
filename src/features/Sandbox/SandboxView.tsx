import { Button, Dropdown, Icon, Menu, Modal } from 'antd';
import classNames from 'classnames';
import { FlexColumn, FlexFillGreedy, FlexRow } from 'components';
import { DraggableTabs, ITab } from 'components/DraggableTabs';
import GraphModalFormController from 'components/Modals/GraphModal/GraphModalForm';
import MacroModalFormController from 'components/Modals/MacroModal/MacroModalForm';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { isMacro } from 'utils';
import { GraphTabsSection } from './GraphTabsSection';
import { LogView } from './LogView';
import { DragEndProps } from './managers/sandbox-store';
import { NodeInfoSection } from './NodeInfoSection';
import { nodeSelectDroppableId } from './NodeSelect/NodeSelect';
import { NodeSelectSection } from './NodeSelectSection';
import PromptGraph from './PromptGraph/PromptGraph';
import SelectGraph from './PromptGraph/SelectGraph';
import { SandboxCanvas, sandboxDroppableId } from './Sandbox/SandboxCanvas';

import { BooleanLiteral } from '@babel/types';
import { useStore } from 'overstated';
import { graphModalStore, macroModalStore } from 'stores';
import './SandboxView.less';
import { SandboxStore, StateStore } from './stores';
import { ModalStore } from './stores/modal-store';

const middleDelete = (event: MouseEvent, deleteTab: () => void) => {
    if (event.button === 1) {
        event.preventDefault();
        event.stopPropagation();
        deleteTab();
    }
};

// const TabTemplate: React.FC<
//     ITab & { deleteTab: (tabId: string) => void; isDragging: boolean }
// > = ({ name, id, isDragging, deleteTab }) => {
//     return (
//         <div
//             className={classNames({ tab: true, dragging: isDragging })}
//             onMouseDown={event =>
//                 middleDelete(event.nativeEvent, () => deleteTab(id))
//             }
//         >
//             <span className="tab-title">{name}</span>
//             <span className="tab-close" onMouseDown={() => deleteTab(id)}>
//                 <Icon type="close" />
//             </span>
//         </div>
//     );
// };

// interface IBridgeMenuProps {
//     bridges?: IBridgeInfo[];
//     currentBridge?: IBridgeInfo;
//     onSelect: (bridge: IBridgeInfo) => void;
//     refresh: () => void;
// }

// const BridgeMenu: React.FC<IBridgeMenuProps> = ({
//     bridges,
//     currentBridge,
//     onSelect,
//     refresh,
// }) => (
//     <Menu theme="dark">
//         {bridges &&
//             bridges.map(b => (
//                 <Menu.Item
//                     key={b.deviceIdentifier}
//                     onClick={() => onSelect(b)}
//                     disabled={
//                         currentBridge &&
//                         b.deviceIdentifier === currentBridge.deviceIdentifier
//                     }
//                 >
//                     {b.deviceName}
//                 </Menu.Item>
//             ))}
//         {!bridges && (
//             <Menu.Item key="none" disabled>
//                 No Bridges
//             </Menu.Item>
//         )}
//         <Menu.Divider />
//         <Menu.Item key="refresh" onClick={() => refresh()}>
//             <Icon type="sync" />
//             Refresh Bridges
//         </Menu.Item>
//     </Menu>
// );

// interface ISandboxHeaderProps {
//     sandboxStore: SandboxStore;
//     canSave: boolean;
//     isSaving: boolean;
//     canEdit: boolean;
//     canRun: boolean;
//     isRunning: boolean;
//     canSelectBridge: boolean;
//     isBridgeLoading: boolean;
//     editGraph: (graph: Graph | Macro | undefined) => void;
// }

// const SandboxHeader: React.FC<ISandboxHeaderProps> = ({
//     canSave,
//     isSaving,
//     canEdit,
//     canRun,
//     isRunning,
//     canSelectBridge,
//     isBridgeLoading,
//     sandboxStore,
//     editGraph,
// }) => (
//     <FlexRow className="sandbox-header" flex="0 1 auto">
//         <FlexRow gap={5}>
//             <Button
//                 disabled={!canSave}
//                 shape="round"
//                 type="primary"
//                 icon="save"
//                 loading={isSaving}
//                 onClick={() => sandboxStore.saveGraph()}
//             >
//                 Save
//             </Button>
//             <Button
//                 disabled={!canEdit}
//                 shape="round"
//                 type="primary"
//                 icon="setting"
//                 onClick={() => editGraph(sandboxStore.tabManager.activeGraph!)}
//             >
//                 Edit Graph
//             </Button>
//         </FlexRow>
//         <FlexFillGreedy />
//         <FlexRow gap={5}>
//             <Button
//                 type="primary"
//                 shape="round"
//                 icon="caret-right"
//                 disabled={!canRun}
//                 onMouseDown={() => sandboxStore.runGraph()}
//                 loading={isRunning}
//             >
//                 Run
//             </Button>
//             <Dropdown
//                 disabled={!canSelectBridge}
//                 overlay={
//                     <BridgeMenu
//                         onSelect={sandboxStore.onBridgeSelect}
//                         bridges={sandboxStore.stateManager.bridges}
//                         currentBridge={
//                             sandboxStore.stateManager.hasBridges
//                                 ? sandboxStore.stateManager.activeBridge
//                                 : undefined
//                         }
//                         refresh={sandboxStore.refreshBridges}
//                     />
//                 }
//             >
//                 <Button
//                     type="primary"
//                     shape="round"
//                     icon="deployment-unit"
//                     loading={isBridgeLoading}
//                 >
//                     {!sandboxStore.stateManager.hasActiveBridge
//                         ? 'Bridge(s)'
//                         : sandboxStore.stateManager.activeBridge.deviceName}
//                     <Icon type="down" />
//                 </Button>
//             </Dropdown>
//         </FlexRow>
//     </FlexRow>
// );

// const dragContextOnDragEnd = (
//     { result }: DragEndProps,
//     sandboxStore: SandboxStore
// ) => {
//     if (!sandboxStore.tabManager.hasActiveTab || !result.destination) {
//         return;
//     }

//     if (
//         result.source.droppableId.startsWith(nodeSelectDroppableId) &&
//         result.destination.droppableId === sandboxDroppableId
//     ) {
//         sandboxStore.addNode(result.draggableId);
//     }
// };

export const SandboxView = () => {
    const {
        sandboxStore,
        modalStore,
        onDragNodeCanvas,
        nodeInfoOpen,
        nodeSelectOpen,
        registerEvents,
        disposeEvents,
        stateStore,
        tabs,
        isLoadingDefinitions,
        isLoadingGraph,
        graphStore,
        links,
        nodes,
        addTab,
        selectionState,
        choosingState,
        edittingSettings,
    } = useStore(SandboxStore, app => ({
        onDragNodeCanvas: app.graphStore.onCanvasDrag,
        nodeInfoOpen: app.panelStore.state.nodeInfoOpen,
        nodeSelectOpen: app.panelStore.state.nodeSelectOpen,
        registerEvents: app.registerKeyEvents,
        disposeEvents: app.disposeKeyEvents,
        stateStore: app.stateStore,
        tabs: app.stateStore.state.tabs,
        isLoadingGraph: app.state.isLoadingGraph,
        isLoadingDefinitions: app.state.isLoadingDefinitions,
        graphStore: app.graphStore,
        modalStore: app.modalStore,
        sandboxStore: app,
        links: app.graphStore.state.links,
        nodes: app.graphStore.state.nodes,
        addTab: app.stateStore.addTab,
        selectionState: app.modalStore.state.isInSelectionState,
        choosingState: app.modalStore.state.isChoosingGraphState,
        edittingSettings: app.stateStore.state.edittingSettings,
    }));

    useEffect(() => {
        registerEvents();
        return () => {
            disposeEvents();
        };
    }, []);

    function handleTabClick(tabId: string) {
        // sandboxStore.tabManager.setActiveTab(tabId);
    }

    const tabReorder = useCallback(
        (orderedTabs: ITab[]) =>
            stateStore.setTabs(orderedTabs.map(t => t.data)),
        []
    );

    console.log(links, nodes);

    return (
        <>
            <FlexRow className="sandbox-view-container">
                <DragDropContext onDragEnd={onDragNodeCanvas}>
                    <FlexRow className="graph-content">
                        <NodeSelectSection open={nodeSelectOpen} />
                        <FlexColumn flex="1 1 0%" style={{ minWidth: 0 }}>
                            <GraphTabsSection
                                activeTab={stateStore.getActiveTab()}
                                deleteTab={stateStore.removeTab}
                                onTabAdd={() => {}}
                                onTabClick={stateStore.setActiveTab}
                                tabs={tabs}
                                onTabReorder={tabReorder}
                            />
                            <SandboxCanvas
                                graphStore={graphStore}
                                loading={isLoadingGraph}
                                isActive={stateStore.hasActiveTab()}
                                hasUnread={false}
                                toggleConsole={() => {}}
                                canToggleConsole={false}
                                visibleLinks={true}
                                isConsoleLoading={false}
                                links={links}
                                nodes={nodes}
                            />
                        </FlexColumn>
                        <NodeInfoSection open={nodeInfoOpen} />
                    </FlexRow>
                </DragDropContext>
            </FlexRow>
            <ModalContainer
                sandboxStore={sandboxStore}
                modalStore={modalStore}
                hasTabs={stateStore.hasTabs()}
                hasActiveTab={stateStore.hasActiveTab()}
                selectionState={selectionState}
                choosingState={choosingState}
                addTab={addTab}
                edittingSettings={edittingSettings}
            />
        </>
    );
};

interface IModalContainerProps {
    sandboxStore: SandboxStore;
    modalStore: ModalStore;
    selectionState: boolean;
    choosingState: boolean;
    hasTabs: boolean;
    hasActiveTab: boolean;
    addTab: (graph: Graph | Macro) => void;
    edittingSettings: boolean;
}

const ModalContainer: React.FC<IModalContainerProps> = ({
    sandboxStore,
    modalStore,
    hasTabs,
    selectionState,
    choosingState,
    hasActiveTab,
    addTab,
    edittingSettings,
}) => {
    const onGraphCancel = useCallback(() => {
        if (edittingSettings) {
        } else {
            modalStore.toggleSelectionState(true);
        }
    }, [edittingSettings]);

    const onGraphSelect = useCallback(() => {
        modalStore.toggleSelectionState(false);
        modalStore.toggleChoosingGraphState(true);
    }, []);

    const onGraphCreate = useCallback((type: GraphType) => {
        modalStore.toggleSelectionState(false);
        if (type === 'graph') {
            graphModalStore.openModal({ isActive: true });
        } else {
            macroModalStore.openModal();
        }
    }, []);

    const graphSelectCancel = useCallback(() => {
        modalStore.toggleChoosingGraphState(false);
        modalStore.toggleSelectionState(true);
    }, []);

    const onGraphAdd = useCallback(
        (graph: Graph | Macro) => {
            modalStore.toggleChoosingGraphState(false);
            addTab(graph);
        },
        [addTab]
    );

    return (
        <>
            <GraphModalFormController
                onSave={sandboxStore.onEditGraph}
                onGoBack={onGraphCancel}
            />
            <MacroModalFormController
                onSave={sandboxStore.onEditGraph}
                onGoBack={onGraphCancel}
            />
            <Modal
                className="sandbox-modal prompt-graph-modal"
                maskClosable={hasTabs}
                visible={selectionState}
                footer={null}
                onCancel={() => modalStore.toggleSelectionState(false)}
                centered
                closable={hasActiveTab}
            >
                <PromptGraph
                    onSelectGraph={onGraphSelect}
                    onTypeSelect={onGraphCreate}
                />
            </Modal>
            <Modal
                className="sandbox-modal select-graph-modal"
                title="Select Graph or Macro"
                maskClosable={hasTabs}
                visible={choosingState}
                footer={
                    <Button onMouseDown={graphSelectCancel} icon="left">
                        Go Back
                    </Button>
                }
                onCancel={() => modalStore.toggleChoosingGraphState(false)}
                centered
                closable={hasActiveTab}
            >
                <SelectGraph onGraphSelect={onGraphAdd} />
            </Modal>
            {/* <Modal
                className="sandbox-modal log-view-modal"
                title="Console"
                maskClosable
                visible={sandboxStore.stateManager.viewState.logs}
                style={{ minHeight: '80vh', maxHeight: '80vh' }}
                footer={null}
                onCancel={() =>
                    sandboxStore.stateManager.updateViewState('logs', false)
                }
                centered
            >
                <LogView
                    logs={sandboxStore.logManager.activeTabLogs}
                    clearLogs={sandboxStore.logManager.clearLogs}
                />
            </Modal> */}
        </>
    );
};
