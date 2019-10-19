import { message } from 'antd';
import { LogManager, TabManager } from 'features/Sandbox/managers';
import { DrawLinkManager } from 'features/Sandbox/managers/draw-link-manager';
import { SearchManager } from 'features/Sandbox/managers/search-manager';
import { StateManager } from 'features/Sandbox/managers/state-manager';
import NodeController from 'features/Sandbox/Node/node-controller';
import SandboxManager from 'features/Sandbox/Sandbox/sandbox-manager';
import { definitionToNode, flatten, getPort } from 'features/Sandbox/utils';
import { computed, observable, runInAction } from 'mobx';
import moment from 'moment';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { GraphService, MacroService, NodeService } from 'services';
import { getGraphType, isMacro } from 'utils';
import userStore from '../../../stores/user-store';
import { SimpleObservable } from '../../../utils/simple-observable';
import { convertToSelectFriendly } from '../utils';
import { HubManager, HubType } from './hub-manager';

export type DragEndProps = { result: DropResult; provided: ResponderProvided };

const tryGetValue = (node: NodeData, key: string, defaultValue?: any) => {
    if (node.fieldData) {
        const fd = node.fieldData.firstOrDefault(x => x.key === key);
        return (fd && fd.value) || defaultValue;
    }

    return defaultValue;
};

export class SandboxStore implements IDisposable {
    public dragEndObservable: SimpleObservable<
        DragEndProps
    > = new SimpleObservable();

    @observable
    public sandboxManager: SandboxManager;

    @observable
    public tabManager: TabManager;

    @observable
    public drawLinkManager: DrawLinkManager;

    @observable
    public logManager: LogManager;

    @observable
    public searchManager: SearchManager;

    @observable
    public hubManager: HubManager;

    @observable
    public stateManager: StateManager;

    @computed
    public get canRun(): boolean {
        const { sandboxState, hasActiveBridge } = this.stateManager;
        const { loadingGraph, loadingBridges } = sandboxState;
        const { isGraphConnected } = this.hubManager;
        return (
            !loadingGraph &&
            !loadingBridges &&
            isGraphConnected &&
            hasActiveBridge
        );
    }

    @computed
    public get isLoading(): boolean {
        const { sandboxState } = this.stateManager;
        const { loadingGraph, loadingBridges } = sandboxState;
        const { isGraphConnecting } = this.hubManager;
        return isGraphConnecting || loadingGraph || loadingBridges;
    }

    @computed
    public get canSelectBridge(): boolean {
        const { sandboxState } = this.stateManager;
        const { loadingGraph, loadingBridges } = sandboxState;
        const { isGraphConnected } = this.hubManager;
        return isGraphConnected && !loadingGraph && !loadingBridges;
    }

    @computed
    public get areLogsEnabled(): boolean {
        const { hasActiveTab } = this.tabManager;
        const { isTerminalConnected } = this.hubManager;
        return isTerminalConnected && hasActiveTab;
    }

    private sandboxActive = false;
    private runTimeout: NodeJS.Timeout;

    constructor() {
        this.tabManager = new TabManager(
            tab => this.load(tab.graph),
            empty => {
                if (empty) {
                    this.stateManager.resetViewState();
                    this.sandboxManager.clearView();
                }

                this.stateManager.resetModalState();
            },
            msg => {
                this.notify(msg, 'error');
            }
        );

        this.sandboxManager = new SandboxManager(
            this.onPortEvent,
            this.handleCanvasDown,
            this.handleNodeDblClick
        );

        this.logManager = new LogManager(this.tabManager);

        // this.drawLinkManager = new DrawLinkManager(
        //     this.sandboxManager,
        //     this.notify
        // );

        this.searchManager = new SearchManager(
            () => this.sandboxManager.nodes,
            () => ({} as any)
        );

        this.hubManager = new HubManager(
            this.onGraphConnected,
            () =>
                this.notify(
                    'Lost connection. Attempting reconnect...',
                    'warning'
                ),
            this.onGraphCompleted,
            this.onReceivedBridges,
            this.onBridgeEstablished,
            this.onLostBridge,
            this.onHubDisconnected,
            this.onLogReceived
        );

        this.stateManager = new StateManager();

        document.addEventListener('keydown', this.handleKeyPress);
    }

    public addNode = (nodeDefinitionId: string, centered = false) => {
        const { nodeDefinitions } = this.stateManager;
        const { definitionLookup } = nodeDefinitions;
        const { mousePos } = this.sandboxManager;
        this.sandboxManager.addNode(
            definitionToNode(
                definitionLookup[nodeDefinitionId],
                centered ? { x: 0, y: 0 } : mousePos
            )
        );
    };

    private onGraphConnected = (isReconnect: boolean) => {
        this.refreshBridges();

        if (isReconnect) {
            this.notify('Reconnected to graph service', 'success');
        }
    };

    private onGraphCompleted = (error: IExecutionError) => {
        if (error) {
            this.notify('An exception occurred while executing graph', 'error');
            console.error(error);
        }

        if (this.runTimeout) {
            clearTimeout(this.runTimeout);
        }

        this.stateManager.updateSandboxState('isGraphRunning', false);
    };

    private onReceivedBridges = (bridges: IBridgeInfo[]) => {
        this.stateManager.updateSandboxState('loadingBridges', false);

        if (bridges && bridges.any()) {
            this.stateManager.updateSandboxState('bridges', bridges);

            this.notify(
                `Established connection to ${bridges.length} bridge(s)`,
                'success'
            );
        } else {
            this.notify('No bridges found', 'warning');
        }
    };

    private onBridgeEstablished = (bridge: IBridgeInfo) => {
        if (!this.stateManager.doesBridgeExist(bridge)) {
            this.notify('A new bridge was found!', 'success');
            this.stateManager.updateSandboxState('bridges', [
                ...this.stateManager.bridges,
                bridge,
            ]);
        } else {
            this.stateManager.bridges.addOrUpdate(
                bridge,
                b => b.deviceIdentifier === bridge.deviceIdentifier
            );
        }

        if (this.stateManager.hasActiveBridge) {
            const { activeBridge } = this.stateManager;
            if (activeBridge.deviceIdentifier === bridge.deviceIdentifier) {
                this.stateManager.updateSandboxState('activeBridge', bridge);
            }
        }
    };

    private onLostBridge = (connectionId: string) => {
        const { bridges } = this.stateManager;
        if (bridges.any(b => b.connectionId === connectionId)) {
            this.stateManager.updateSandboxState(
                'bridges',
                bridges.filter(b => b.connectionId !== connectionId)
            );
            this.notify('Connection to bridge was lost', 'warning');
        }
    };

    private onHubDisconnected = (type: HubType) => {
        this.notify(`Lost ${type} connection`, 'error');
    };

    private onLogReceived = (log: LogData) => {
        const { activeTab } = this.tabManager;
        const { logs } = this.stateManager.viewState;
        if (activeTab) {
            this.logManager.addLog(activeTab.graph.id, {
                ...log,
                timestamp: moment.now(),
                unread: !logs,
            });
        }
    };

    private handleKeyPress = (event: KeyboardEvent) => {
        if (!this.sandboxActive) {
            return;
        }

        if (event.ctrlKey || event.metaKey) {
            switch (event.keyCode) {
                case 83:
                    event.preventDefault();
                    this.saveGraph();
                    break;
                case 90:
                    this.stateManager.toggleViewState('nodeSelect');
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    break;
                case 88:
                    this.stateManager.toggleViewState('nodeInfo');
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    break;
                case 67:
                    this.stateManager.toggleViewState('logs');
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    break;
                case 32:
                    this.sandboxManager.resetView();
                    break;
                case 27:
                    const { activeTab } = this.tabManager;
                    const {
                        initialPrompt,
                        select,
                    } = this.stateManager.modalState;
                    if (!activeTab && (initialPrompt || select)) {
                        event.stopImmediatePropagation();
                        event.preventDefault();
                    }

                    this.drawLinkManager.stopDrawing();
                    break;
            }
        }
    };

    private handleNodeDblClick = (node: NodeController) => {
        this.stateManager.toggleViewState('nodeInfo');
    };

    private handleCanvasDown = (event: MouseEvent) => {
        this.drawLinkManager.stopDrawing();
    };

    public onBridgeSelect = (bridge: IBridgeInfo) => {
        this.stateManager.updateSandboxState('activeBridge', bridge);
    };

    public refreshBridges = () => {
        this.stateManager.updateSandboxState('loadingBridges', true);
        this.hubManager.graphHub.requestBridges();
    };

    public loadDefinitions = async (
        graphId: string,
        type: GraphType,
        forceRefresh?: boolean
    ) => {
        this.stateManager.updateSandboxState('loadingDefinitions', true);

        if (forceRefresh || !this.stateManager.hasCachedDefinition(graphId)) {
            const definitions = await NodeService.getAllNodeDefinitions(
                graphId,
                type
            );
            const definitionList = flatten(definitions);
            this.stateManager.cacheDefinitions(graphId, {
                definitionList,
                definitions,
                definitionLookup: definitionList.toDictionary('fullName'),
                selectFriendly: convertToSelectFriendly(definitions.children),
            });
        }

        this.stateManager.updateSandboxState('loadingDefinitions', false);
        return this.stateManager.getCachedDefinition(graphId);
    };

    public saveGraph = async () => {
        const { hasActiveTab } = this.tabManager;
        if (!hasActiveTab) {
            return;
        }

        this.stateManager.updateSandboxState('savingGraph', true);

        try {
            const graph = this.getGraphData();
            if (isMacro(graph)) {
                await MacroService.update(graph);
            } else {
                await GraphService.update(graph);
            }
            this.notify('Graph saved successfully', 'success');
        } catch (e) {
            this.notify('Unable to save graph', 'error');
        }

        this.stateManager.updateSandboxState('savingGraph', false);
    };

    public runGraph = () => {
        const { graphHub, isGraphConnected } = this.hubManager;
        const { activeBridge, hasActiveBridge } = this.stateManager;
        if (isGraphConnected && hasActiveBridge) {
            const connectionId = activeBridge.connectionId;
            const graph = this.getGraphData();

            this.stateManager.updateSandboxState('isGraphRunning', true);

            if (isMacro(graph)) {
                // this.graphHub.runMacro(graph);
            } else {
                graphHub.runGraph(graph, connectionId);
            }

            this.runTimeout = setTimeout(() => {
                this.stateManager.updateSandboxState('isGraphRunning', false);
                this.notify('Timeout exception', 'error');
            }, 30000);
        }
    };

    public onNodeEdit = (node: INodeUIData) => {
        this.stateManager.toggleViewState('nodeInfo');
    };

    public onPortEvent = (
        event: PortEvent,
        element: HTMLDivElement,
        data: IPortUIData,
        node: NodeController
    ) => {
        // this.drawLinkManager.toggleDraw(event, element, data, node);
    };

    public load = async (graph: Partial<Graph | Macro>) => {
        this.stateManager.updateSandboxState('loadingGraph', true);

        const { nodes, links, id } = graph;
        const definitions = await this.loadDefinitions(
            id!,
            getGraphType(graph)
        );

        const uiNodes = (nodes || []).map<INodeUIData>(n => {
            const info = definitions.definitionLookup[n.fullName];
            const { flowInputs, flowOutputs, valueInputs, valueOutputs } = info;
            return {
                id: n.id,
                fullName: n.fullName,
                position: n.position,
                description: info.description,
                macroFieldId: info.macroFieldId,
                macroId: info.macroId,
                portData: {
                    flowInputs: (flowInputs || []).map<IPortUIData>(fi => ({
                        id: fi.key,
                        name: fi.label,
                        io: 'input',
                        type: 'flow',
                        value: tryGetValue(n, fi.key),
                    })),
                    flowOutputs: (flowOutputs || []).map<IPortUIData>(fo => ({
                        id: fo.key,
                        name: fo.label,
                        io: 'output',
                        type: 'flow',
                        value: tryGetValue(n, fo.key),
                    })),
                    valueInputs: (valueInputs || []).flatMap<IPortUIData>(
                        vi => {
                            if (vi.indefinite && n.fieldData) {
                                return n.fieldData
                                    .filter(x => x.key.includes('|'))
                                    .map(fd => ({
                                        id: fd.key,
                                        name: vi.label,
                                        io: 'input',
                                        type: 'value',
                                        valueType: vi.valueType,
                                        defaultValue: vi.defaultValue,
                                        indefinite: vi.indefinite,
                                        value: tryGetValue(
                                            n,
                                            fd.key,
                                            vi.defaultValue
                                        ),
                                    }));
                            }

                            return [
                                {
                                    id: vi.key,
                                    name: vi.label,
                                    io: 'input',
                                    type: 'value',
                                    valueType: vi.valueType,
                                    defaultValue: vi.defaultValue,
                                    indefinite: vi.indefinite,
                                    value: tryGetValue(
                                        n,
                                        vi.key,
                                        vi.defaultValue
                                    ),
                                },
                            ];
                        }
                    ),
                    valueOutputs: (valueOutputs || []).map<IPortUIData>(vo => ({
                        id: vo.key,
                        name: vo.label,
                        io: 'output',
                        type: 'value',
                        valueType: vo.valueType,
                        value: tryGetValue(n, vo.key),
                    })),
                },
                title: info.title,
                permanent: n.permanent,
                selected: false,
            };
        });

        const nodeLookup = uiNodes.toDictionary('id');

        const uiLinks = (links || []).map<ILinkInitializeData>(l => {
            return {
                sourceNodeId: l.sourceNode,
                sourceData: getPort(nodeLookup[l.sourceNode], l.sourceKey)!,
                destinationNodeId: l.destinationNode,
                destinationData: getPort(
                    nodeLookup[l.destinationNode],
                    l.destinationKey
                )!,
            };
        });

        await this.sandboxManager.load(uiNodes, uiLinks);

        this.hubManager.initialize();
        this.stateManager.updateSandboxState('nodeCache', definitions);
        this.stateManager.updateSandboxState('loadingGraph', true);
        this.stateManager.updateViewState('nodeSelect', true);
    };

    private notify = (
        msg: string,
        type: 'success' | 'info' | 'warning' | 'error' = 'warning',
        duration: number = 3
    ) => {
        switch (type) {
            case 'warning':
                message.warning(msg, duration);
                break;
            case 'error':
                message.error(msg, duration);
                break;
            case 'info':
                message.info(msg, duration);
                break;
            case 'success':
                message.success(msg, duration);
                break;
        }
    };

    private getGraphData = (): Graph | Macro => {
        const { nodes, links } = this.sandboxManager;
        const { activeTab } = this.tabManager;
        const linkData = links.map<LinkData>(l => ({
            sourceNode: l.sourceNodeId,
            sourceKey: l.sourcePortId,
            destinationNode: l.destinationNodeId,
            destinationKey: l.destinationPortId,
        }));

        const nodeData = nodes.map<NodeData>(n => ({
            id: n.id,
            position: n.position,
            fullName: n.nodeData.fullName,
            fieldData: n.nodeData.portData.valueInputs.map<FieldData>(f => ({
                key: f.id,
                value: f.value,
            })),
            macroFieldId: n.nodeData.macroFieldId,
            macroId: n.nodeData.macroId,
        }));

        const { graph } = activeTab!;
        const { user } = userStore;

        return {
            ...graph,
            userId: user!.id,
            nodes: nodeData,
            links: linkData,
        };
    };

    public dispose(): void {
        this.dragEndObservable.clear();
        this.sandboxManager.dispose();
        this.tabManager.dispose();
        this.drawLinkManager.dispose();
        this.logManager.dispose();

        this.stateManager.dispose();
        this.hubManager.dispose();
    }
}
