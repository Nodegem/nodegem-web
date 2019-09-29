import {
    Badge,
    Button,
    Checkbox,
    Icon,
    Modal,
    Tooltip,
    Typography,
} from 'antd';
import classNames from 'classnames';
import { XTerm } from 'components';
import { DraggableTabs, ITab } from 'components/DraggableTabs';
import HorizontalCollapse from 'components/HorizontalCollapse/HorizontalCollapse';
import GraphModalFormController from 'components/Modals/GraphModal/GraphModalForm';
import MacroModalFormController from 'components/Modals/MacroModal/MacroModalForm';
import { VerticalCollapsible } from 'components/VerticalCollapsible/VerticalCollapsible';
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
            mouseEnterDelay={0.25}
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
                onClick={() => runGraph()}
                loading={graphState.connecting || graphState.running}
            >
                Run
            </Button>
            <Badge count={5}>
                <Button
                    disabled={!graph || !terminalState.connected}
                    shape="round"
                    type="primary"
                    icon="code"
                    loading={terminalState.connecting}
                    onClick={() => toggleLogs()}
                >
                    Logs
                </Button>
            </Badge>
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
                loading={saving}
                onClick={() => saveGraph()}
            >
                Save
            </Button>
        </div>
    );
};

export const SandboxView = observer(() => {
    const { sandboxStore, graphModalStore, macroModalStore } = useStore();
    const { tabManager, drawLinkManager, sandboxManager } = sandboxStore;

    useEffect(() => {
        if (!tabManager.hasTabs) {
            sandboxStore.toggleModalState('selectionModal', true);
        }

        sandboxStore.dragEndObservable.subscribe(onDragEnd);
        return () => {
            sandboxStore.dispose();
        };
    }, [sandboxStore]);

    function onDragEnd({ result }: DragEndProps) {
        if (!tabManager.hasActiveTab || !result.destination) {
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
        tabManager.setActiveTab(tabId);
    }

    function handleTabReorder(orderedTabs: any[]) {
        tabManager.setTabs(orderedTabs.map(x => x.data));
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
                tabManager.addTab(graph);
            } else {
                tabManager.editTab(graph);
            }
        }
    };

    return (
        <>
            <div className="sandbox-view-container">
                <DraggableTabs
                    tabs={tabManager.tabs.map(t => ({
                        id: t.graph.id!,
                        name: t.graph.name!,
                        data: t,
                    }))}
                    activeTab={
                        tabManager.activeTab && tabManager.activeTab.graph.id
                    }
                    onTabReorder={handleTabReorder}
                    dragEndObservable={sandboxStore.dragEndObservable}
                    onTabAdd={() =>
                        sandboxStore.toggleModalState('selectionModal')
                    }
                    onTabClick={handleTabClick}
                    tabControls={
                        <GraphControls
                            graph={
                                tabManager.activeTab &&
                                tabManager.activeTab.graph
                            }
                            openModal={editGraph}
                            toggleLogs={() =>
                                sandboxStore.toggleViewState('logs')
                            }
                            saveGraph={sandboxStore.saveGraph}
                            runGraph={sandboxStore.runGraph}
                            graphState={sandboxStore.hubStates.graph}
                            terminalState={sandboxStore.hubStates.terminal}
                            saving={sandboxStore.sandboxState.savingGraph}
                        />
                    }
                    tabTemplate={(tab, isDragging) => (
                        <TabTemplate
                            {...tab}
                            isDragging={isDragging}
                            deleteTab={tabManager.deleteTab}
                        />
                    )}
                />
                <DragDropContext
                    onDragEnd={(result, provided) => {
                        sandboxStore.dragEndObservable.execute({
                            result,
                            provided,
                        });
                    }}
                >
                    <div className="graph-content">
                        <VerticalCollapsible
                            width="325px"
                            minWidth="0"
                            onTabClick={() =>
                                sandboxStore.toggleViewState('nodeSelect')
                            }
                            tabContent="Nodes"
                            collapsed={!sandboxStore.viewStates.nodeSelect}
                        >
                            <NodeSelect
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
                        </VerticalCollapsible>
                        <div
                            style={{
                                flex: '1 1 auto',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <SandboxCanvas
                                loading={sandboxStore.sandboxState.loadingGraph}
                                isActive={tabManager.hasActiveTab}
                                editNode={sandboxStore.onNodeEdit}
                                getDrawLinkRef={
                                    drawLinkManager.fakeLink.getElementRef
                                }
                                isDrawing={drawLinkManager.isDrawing}
                                linkType={drawLinkManager.fakeLink.type}
                                links={sandboxManager.links}
                                sandboxManager={sandboxManager}
                                nodes={sandboxManager.nodes}
                                visibleLinks={
                                    sandboxStore.sandboxState.linksVisible
                                }
                            />

                            <HorizontalCollapse
                                className="log-section"
                                collapsed={!sandboxStore.viewStates.logs}
                                height="25%"
                            >
                                <XTerm
                                    getRef={sandboxStore.logManager.setXterm}
                                />
                            </HorizontalCollapse>
                        </div>
                        <VerticalCollapsible
                            width="350px"
                            minWidth="0"
                            onTabClick={() =>
                                sandboxStore.toggleViewState('nodeInfo')
                            }
                            tabDirection="left"
                            tabContent="Node Info"
                            collapsed={!sandboxStore.viewStates.nodeInfo}
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

            <GraphModalFormController onSave={onGraphEdit} />
            <MacroModalFormController onSave={onGraphEdit} />
            <Modal
                maskClosable={tabManager.hasTabs}
                visible={sandboxStore.modalStates.selectionModal}
                footer={null}
                onCancel={() =>
                    sandboxStore.toggleModalState('selectionModal', false)
                }
                width="50%"
                style={{ maxWidth: '850px' }}
                centered
            >
                <PromptGraph
                    onSelectGraph={onGraphSelect}
                    onTypeSelect={handleGraphCreate}
                />
            </Modal>
            <Modal
                title="Select Graph or Macro"
                maskClosable={tabManager.hasTabs}
                visible={sandboxStore.modalStates.selectGraph}
                footer={null}
                width="50%"
                style={{ maxWidth: '850px' }}
                onCancel={() =>
                    sandboxStore.toggleModalState('selectGraph', false)
                }
                centered
            >
                <SelectGraph
                    onGraphSelect={g => {
                        sandboxStore.toggleModalState('selectGraph', false);
                        tabManager.addTab(g);
                    }}
                />
            </Modal>
        </>
    );
});
