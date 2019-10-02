import { message } from 'antd';
import GraphHub from 'features/Sandbox/hubs/graph-hub';
import TerminalHub from 'features/Sandbox/hubs/terminal-hub';
import { LogManager, TabManager } from 'features/Sandbox/managers';
import { DrawLinkManager } from 'features/Sandbox/managers/draw-link-manager';
import { SearchManager } from 'features/Sandbox/managers/search-manager';
import NodeController from 'features/Sandbox/Node/node-controller';
import SandboxManager from 'features/Sandbox/Sandbox/sandbox-manager';
import { flatten, getPort } from 'features/Sandbox/utils';
import { action, observable, runInAction } from 'mobx';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { GraphService, MacroService, NodeService } from 'services';
import { getGraphType, isMacro } from 'utils';
import { convertToSelectFriendly } from './../features/Sandbox/utils';
import { SimpleObservable } from './../utils/simple-observable';
import userStore from './user-store';

export type DragEndProps = { result: DropResult; provided: ResponderProvided };

type NodeCache = {
    definitions: IHierarchicalNode<NodeDefinition>;
    definitionList: NodeDefinition[];
    definitionLookup: { [id: string]: NodeDefinition };
    selectFriendly: SelectFriendly<NodeDefinition>;
};

const tryGetValue = (node: NodeData, key: string, defaultValue?: any) => {
    if (node.fieldData) {
        const fd = node.fieldData.firstOrDefault(x => x.key === key);
        return (fd && fd.value) || defaultValue;
    }

    return defaultValue;
};

type SandboxState = {
    loadingDefinitions: boolean;
    loadingGraph: boolean;
    linksVisible: boolean;
    savingGraph: boolean;
};

type ViewState = {
    logs: boolean;
    nodeInfo: boolean;
    nodeSelect: boolean;
};

type ModalState = {
    selectionModal: boolean;
    selectGraph: boolean;
};

export class SandboxStore implements IDisposable {
    private _cachedDefinitions: {
        [graphId: string]: NodeCache;
    } = {};

    @observable
    public nodeDefinitionCache: NodeCache;

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
    public modalStates: ModalState = {
        selectionModal: false,
        selectGraph: false,
    };

    @observable
    public viewStates: ViewState = {
        logs: false,
        nodeInfo: false,
        nodeSelect: false,
    };

    @observable
    public sandboxState: SandboxState = {
        loadingDefinitions: false,
        loadingGraph: false,
        linksVisible: true,
        savingGraph: false,
    };

    @observable
    public hubStates: {
        terminal: {
            hub: TerminalHub;
            connected?: boolean;
            connecting?: boolean;
        };
        graph: {
            hub: GraphHub;
            connected?: boolean;
            connecting?: boolean;
            running?: boolean;
            bridges?: IBridgeInfo[];
        };
    } = {
        terminal: { hub: new TerminalHub() },
        graph: { hub: new GraphHub() },
    };

    private sandboxActive = false;

    constructor() {
        this.tabManager = new TabManager(
            tab => this.load(tab.graph),
            empty => {
                runInAction(() => {
                    if (empty) {
                        this.nodeDefinitionCache = {} as any;
                        this.toggleViewState('nodeInfo', false);
                        this.toggleViewState('nodeSelect', false);
                        this.toggleViewState('logs', false);
                        this.sandboxManager.clearView();
                    }

                    this.toggleModalState('selectionModal', false);
                    this.toggleModalState('selectGraph', false);
                });
            }
        );

        this.sandboxManager = new SandboxManager(
            this.onPortEvent,
            this.handleCanvasDown,
            this.handleNodeDblClick
        );

        this.logManager = new LogManager(this.tabManager);

        this.drawLinkManager = new DrawLinkManager(
            this.sandboxManager,
            this.notify
        );

        this.searchManager = new SearchManager(
            () => this.sandboxManager.nodes,
            () =>
                (this.nodeDefinitionCache &&
                    this.nodeDefinitionCache.selectFriendly) ||
                {}
        );

        document.addEventListener('keydown', this.handleKeyPress);
    }

    public setSandboxActive = (active: boolean) => {
        this.sandboxActive = active;
    };

    public initializeHubs = () => {
        const { terminal, graph } = this.hubStates;

        if (!terminal.connected) {
            terminal.hub.dispose();
            terminal.hub.onConnecting.subscribe(() =>
                runInAction(() => {
                    this.hubStates.terminal = {
                        ...this.hubStates.terminal,
                        connected: false,
                        connecting: true,
                    };
                })
            );

            terminal.hub.onConnected.subscribe(() =>
                runInAction(() => {
                    this.hubStates.terminal = {
                        ...this.hubStates.terminal,
                        connecting: false,
                        connected: true,
                    };
                })
            );

            terminal.hub.log.subscribe(data =>
                runInAction(() => {
                    if (this.tabManager.activeTab) {
                        this.logManager.addLog(
                            this.tabManager.activeTab.graph.id,
                            {
                                ...data,
                                unread: !this.viewStates.logs,
                            }
                        );
                    }
                })
            );

            terminal.hub.onDisconnected.subscribe(() =>
                runInAction(() => {
                    this.notify('Lost terminal connection', 'error');
                    this.hubStates.terminal = {
                        ...this.hubStates.terminal,
                        connected: false,
                        connecting: false,
                    };
                })
            );

            terminal.hub.attemptConnect();
        }

        if (!graph.connected) {
            graph.hub.dispose();
            graph.hub.onConnecting.subscribe(() =>
                runInAction(() => {
                    this.hubStates.graph = {
                        ...this.hubStates.graph,
                        connected: false,
                        connecting: true,
                    };
                })
            );

            graph.hub.executionError.subscribe(value => {
                console.log(value);
            });

            graph.hub.onConnected.subscribe(() =>
                runInAction(() => {
                    this.hubStates.graph.hub.requestBridges();
                })
            );

            graph.hub.bridgeInfo.subscribe(bridges => {
                runInAction(() => {
                    this.hubStates.graph = {
                        ...this.hubStates.graph,
                        bridges,
                        connecting: false,
                        connected: bridges.any(),
                    };

                    if (bridges.any()) {
                        this.notify(
                            `Established connection to ${bridges.length} bridge(s)`,
                            'success'
                        );
                    } else {
                        this.notify(`Couldn't find any bridges`, 'warning');
                    }
                });
            });

            graph.hub.onDisconnected.subscribe(() =>
                runInAction(() => {
                    this.notify('Lost graph connection', 'error');

                    this.hubStates.graph = {
                        ...this.hubStates.graph,
                        connected: false,
                        connecting: false,
                    };
                })
            );
            graph.hub.attemptConnect();
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
            }
        } else {
            switch (event.keyCode) {
                case 32:
                    this.sandboxManager.resetView();
                    break;
                case 27:
                    if (
                        (!this.tabManager.activeTab &&
                            this.modalStates.selectGraph) ||
                        this.modalStates.selectionModal
                    ) {
                        event.stopImmediatePropagation();
                        event.preventDefault();
                    }

                    this.drawLinkManager.stopDrawing();
                    break;
            }
        }
    };

    private handleNodeDblClick = (node: NodeController) => {
        this.toggleViewState('nodeInfo');
    };

    private handleCanvasDown = (event: MouseEvent) => {
        this.drawLinkManager.stopDrawing();
    };

    public toggleSandboxState = (key: keyof SandboxState, value?: boolean) => {
        this.sandboxState[key] = this.sandboxState[key].toggle(value);
    };

    public toggleViewState = (key: keyof ViewState, value?: boolean) => {
        const newValue = this.viewStates[key].toggle(value);
        if (key === 'logs' && newValue) {
            this.logManager.markAllAsRead();
        }

        this.viewStates[key] = newValue;
    };

    public toggleModalState = (key: keyof ModalState, value?: boolean) => {
        this.modalStates[key] = this.modalStates[key].toggle(value);
    };

    public loadDefinitions = async (
        graphId: string,
        type: GraphType,
        forceRefresh?: boolean
    ) => {
        this.sandboxState = {
            ...this.sandboxState,
            loadingDefinitions: true,
        };

        if (forceRefresh || !this._cachedDefinitions[graphId]) {
            const definitions = await NodeService.getAllNodeDefinitions(
                graphId,
                type
            );
            const definitionList = flatten(definitions);
            this._cachedDefinitions[graphId] = {
                definitionList,
                definitions,
                definitionLookup: definitionList.toDictionary('fullName'),
                selectFriendly: convertToSelectFriendly(definitions.children),
            };
        }

        runInAction(
            () =>
                (this.sandboxState = {
                    ...this.sandboxState,
                    loadingDefinitions: false,
                })
        );
        return this._cachedDefinitions[graphId];
    };

    public saveGraph = async () => {
        if (!this.tabManager.hasActiveTab) {
            return;
        }

        this.sandboxState = {
            ...this.sandboxState,
            savingGraph: true,
        };

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

        runInAction(() => {
            this.sandboxState = {
                ...this.sandboxState,
                savingGraph: false,
            };
        });
    };

    public runGraph = () => {
        const { hub, bridges } = this.hubStates.graph;
        if (hub.isConnected && bridges && bridges.any()) {
            const connectionId = bridges.firstOrDefault()!.connectionId;
            const graph = this.getGraphData();

            if (isMacro(graph)) {
                // this.graphHub.runMacro(graph);
            } else {
                hub.runGraph(graph, connectionId);
            }
        }
    };

    public onNodeEdit = (node: INodeUIData) => {
        this.toggleViewState('nodeInfo');
    };

    public onPortEvent = (
        event: PortEvent,
        element: HTMLDivElement,
        data: IPortUIData,
        node: NodeController
    ) => {
        this.drawLinkManager.toggleDraw(event, element, data, node);
    };

    public load = async (graph: Partial<Graph | Macro>) => {
        this.sandboxState.loadingGraph = true;

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

        runInAction(() => {
            this.nodeDefinitionCache = definitions;
            this.initializeHubs();
            this.sandboxState.loadingGraph = false;

            if (!this.viewStates.nodeSelect) {
                setTimeout(() => {
                    this.toggleViewState('nodeSelect', true);
                }, 350);
            }
        });
    };

    public disconnectHubs = () => {
        const { graph, terminal } = this.hubStates;
        graph.hub.disconnect();
        terminal.hub.disconnect();
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
        const { graph, terminal } = this.hubStates;
        graph.hub.dispose();
        terminal.hub.dispose();
        this.dragEndObservable.clear();
        this.sandboxManager.dispose();
        this.tabManager.dispose();
        this.drawLinkManager.dispose();
        this._cachedDefinitions = {};
        this.nodeDefinitionCache = {} as any;

        this.toggleViewState('nodeInfo', false);
        this.toggleModalState('selectionModal', true);
        this.toggleModalState('selectGraph', false);
    }
}
