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
import { GraphStore, SandboxStore, StateStore } from './stores';
import { ModalStore } from './stores/modal-store';

const middleDelete = (event: MouseEvent, deleteTab: () => void) => {
    if (event.button === 1) {
        event.preventDefault();
        event.stopPropagation();
        deleteTab();
    }
};

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

export const SandboxView = () => {
    const sandboxState = useStore(SandboxStore, app => ({
        sandboxStore: app,
        graphStore: app.graphStore,
        stateStore: app.stateStore,
        onDragNodeCanvas: app.graphStore.onCanvasDrag,
        addTab: app.stateStore.addTab,
        setTabs: app.stateStore.setTabs,
        activeTab: app.stateStore.activeTab,
        hasTabs: app.stateStore.hasTabs,
        onEditGraph: app.onEditGraph,
        toggleSelectionState: app.modalStore.toggleSelectionState,
        toggleChoosingGraphState: app.modalStore.toggleChoosingGraphState,
        nodeCache: app.graphStore.nodeCache,
        ...app.state,
        ...app.panelStore.state,
        ...app.graphStore.state,
        ...app.modalStore.state,
        ...app.stateStore.state,
    }));

    useEffect(() => {
        sandboxState.sandboxStore.registerEvents();
        sandboxState.sandboxStore.initialize();
        return () => {
            sandboxState.sandboxStore.dispose();
        };
    }, []);

    function handleTabClick(tabId: string) {
        // sandboxStore.tabManager.setActiveTab(tabId);
    }

    const tabReorder = useCallback(
        (orderedTabs: ITab[]) =>
            sandboxState.setTabs(orderedTabs.map(t => t.data)),
        []
    );

    const addNode = useCallback((definition: NodeDefinition) => {
        sandboxState.graphStore.createNodeFromDefinition(
            definition.fullName,
            true
        );
    }, []);

    return (
        <>
            <FlexRow className="sandbox-view-container">
                <DragDropContext onDragEnd={sandboxState.onDragNodeCanvas}>
                    <FlexRow className="graph-content">
                        <NodeSelectSection
                            open={sandboxState.nodeSelectOpen}
                            addNode={addNode}
                            nodeOptions={sandboxState.nodeCache}
                            {...sandboxState}
                        />
                        <FlexColumn flex="1 1 0%" style={{ minWidth: 0 }}>
                            <GraphTabsSection
                                {...sandboxState}
                                onTabReorder={tabReorder}
                                deleteTab={sandboxState.stateStore.removeTab}
                                onTabAdd={() => {}}
                                onTabClick={
                                    sandboxState.stateStore.setActiveTab
                                }
                            />
                            <SandboxCanvas
                                graphStore={sandboxState.graphStore}
                                loading={sandboxState.isLoadingGraph}
                                isActive={sandboxState.stateStore.hasActiveTab}
                                hasUnread={false}
                                toggleConsole={() => {}}
                                canToggleConsole={false}
                                visibleLinks={true}
                                isConsoleLoading={false}
                                links={sandboxState.links}
                                nodes={sandboxState.nodes}
                            />
                        </FlexColumn>
                        <NodeInfoSection open={sandboxState.nodeInfoOpen} />
                    </FlexRow>
                </DragDropContext>
            </FlexRow>
            <ModalContainer
                {...sandboxState}
                hasActiveTab={sandboxState.stateStore.hasActiveTab}
            />
        </>
    );
};

interface IModalContainerProps {
    onEditGraph: (graph?: Graph | Macro) => void;
    toggleSelectionState: (value: boolean) => void;
    toggleChoosingGraphState: (value: boolean) => void;
    addTab: (graph: Graph | Macro) => void;
    isInSelectionState: boolean;
    isChoosingGraphState: boolean;
    hasTabs: boolean;
    hasActiveTab: boolean;
    edittingSettings: boolean;
}

const ModalContainer: React.FC<IModalContainerProps> = ({
    onEditGraph,
    toggleChoosingGraphState,
    toggleSelectionState,
    hasTabs,
    isInSelectionState,
    isChoosingGraphState,
    hasActiveTab,
    addTab,
    edittingSettings,
}) => {
    const onGraphCancel = useCallback(() => {
        if (edittingSettings) {
        } else {
            toggleSelectionState(true);
        }
    }, [edittingSettings]);

    const onGraphSelect = useCallback(() => {
        toggleSelectionState(false);
        toggleChoosingGraphState(true);
    }, []);

    const onGraphCreate = useCallback((type: GraphType) => {
        toggleSelectionState(false);
        if (type === 'graph') {
            graphModalStore.openModal({ isActive: true });
        } else {
            macroModalStore.openModal();
        }
    }, []);

    const graphSelectCancel = useCallback(() => {
        toggleChoosingGraphState(false);
        toggleSelectionState(true);
    }, []);

    const onGraphAdd = useCallback(
        (graph: Graph | Macro) => {
            toggleChoosingGraphState(false);
            addTab(graph);
        },
        [addTab]
    );

    return (
        <>
            <GraphModalFormController
                onSave={onEditGraph}
                onGoBack={onGraphCancel}
            />
            <MacroModalFormController
                onSave={onEditGraph}
                onGoBack={onGraphCancel}
            />
            <Modal
                className="sandbox-modal prompt-graph-modal"
                maskClosable={hasTabs}
                visible={isInSelectionState}
                footer={null}
                onCancel={() => toggleSelectionState(false)}
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
                visible={isChoosingGraphState}
                footer={
                    <Button onMouseDown={graphSelectCancel} icon="left">
                        Go Back
                    </Button>
                }
                onCancel={() => toggleChoosingGraphState(false)}
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
