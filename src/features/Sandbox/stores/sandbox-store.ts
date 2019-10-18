import { appStore } from 'app-state-store';
import localforage from 'localforage';
import { compose, Store } from 'overstated';
import { GraphService, MacroService, NodeService } from 'services';
import { getGraphType } from 'utils';
import { convertToSelectFriendly, flatten, getPort } from '../utils';
import { CanvasStore } from './canvas-store';
import { IntroStore } from './intro-store';
import { LogsStore } from './logs-store';
import { NodeInfoStore } from './node-info-store';
import { NodeSelectStore } from './node-select-store';
import { SandboxHeaderStore } from './sandbox-header-store';
import { TabsStore } from './tabs-store';

interface ISandboxCompose {
    canvasStore: CanvasStore;
    sandboxHeaderStore: SandboxHeaderStore;
    introStore: IntroStore;
    tabsStore: TabsStore;
    logsStore: LogsStore;
    nodeInfoStore: NodeInfoStore;
    nodeSelectStore: NodeSelectStore;
}

interface ISandboxState {
    isLoadingGraph: boolean;
    isLoadingDefinitions: boolean;
}

const tryGetValue = (node: NodeData, key: string, defaultValue?: any) => {
    if (node.fieldData) {
        const fd = node.fieldData.firstOrDefault(x => x.key === key);
        return (fd && fd.value) || defaultValue;
    }

    return defaultValue;
};

@compose({
    canvasStore: CanvasStore,
    sandboxHeaderStore: SandboxHeaderStore,
    introStore: IntroStore,
    tabsStore: TabsStore,
    logsStore: LogsStore,
    nodeInfoStore: NodeInfoStore,
    nodeSelectStore: NodeSelectStore,
})
export class SandboxStore
    extends Store<ISandboxState, undefined, ISandboxCompose>
    implements IDisposable {
    public state: ISandboxState = {
        isLoadingDefinitions: false,
        isLoadingGraph: false,
    };

    public initialize() {
        if (appStore.hasSelectedGraph) {
            this.tabsStore.addTab(appStore.state.selectedGraph!);
        } else {
            this.tryLoadLocalState();
        }
    }

    public registerEvents = () => {
        window.onbeforeunload = () => {
            this.saveStateLocally();
        };
        window.addEventListener('keydown', this.listenToKeyDown);
    };

    public disposeEvents = () => {
        window.removeEventListener('keydown', this.listenToKeyDown);
    };

    public loadDefinitions = async (graphId: string, type: GraphType) => {
        this.setState({ isLoadingDefinitions: true });

        const definitions = await NodeService.getAllNodeDefinitions(
            graphId,
            type
        );
        const definitionList = flatten(definitions);
        const definitionObject = {
            definitionList,
            definitions,
            definitionLookup: definitionList.toDictionary('fullName'),
            selectFriendly: convertToSelectFriendly(definitions.children),
        };

        this.tabsStore.setDefinitionsForGraph(graphId, definitionObject);
        this.setState({ isLoadingDefinitions: false });
        return definitionObject;
    };

    public editGraph = () => {
        // if (graph) {
        //     if (!edit) {
        //         this.stateStore.addTab(graph);
        //     }
        // }
    };

    public saveGraph = () => {};

    public runGraph = () => {};

    public load = async (graph: Graph | Macro) => {
        this.setState({ isLoadingGraph: true });

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

        await this.canvasStore.load(uiNodes, uiLinks);

        this.nodeSelectStore.setNodeOptions(definitions);
        this.setState({ isLoadingGraph: false });
        this.nodeSelectStore.toggleOpen(true);

        // this.hubManager.initialize();
    };

    public saveStateLocally = async () => {
        const { tabs } = this.tabsStore.state;
        const graphInfo = tabs.map(x => ({
            id: x.graph.id,
            type: getGraphType(x.graph),
        }));
        await localforage.setItem('openedTabs', graphInfo);
    };

    public tryLoadLocalState = async () => {
        const graphInfo = await localforage.getItem<
            {
                id: string;
                type: GraphType;
            }[]
        >('openedTabs');

        if (graphInfo && graphInfo.any()) {
            this.suspend();
            for (const graph of graphInfo) {
                if (graph.type === 'graph') {
                    this.tabsStore.addTab(await GraphService.get(graph.id));
                } else {
                    this.tabsStore.addTab(await MacroService.get(graph.id));
                }
            }
            this.unsuspend();
            this.tabsStore.setActiveTab(graphInfo.firstOrDefault()!.id);
        } else {
            this.introStore.toggleStartPrompt(true);
        }
    };

    private listenToKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey || event.metaKey) {
            switch (event.keyCode) {
                case 83:
                    event.preventDefault();
                    // this.saveGraph();
                    break;
                case 90:
                    event.preventDefault();
                    this.nodeSelectStore.toggleOpen();
                    break;
                case 88:
                    event.preventDefault();
                    this.nodeInfoStore.toggleOpen();
                    break;
                case 67:
                    event.preventDefault();
                    this.logsStore.toggleOpen();
                    break;
                case 32:
                    this.canvasStore.resetView();
                    break;
                case 27:
                    // const { activeTab } = this.tabManager;
                    // const {
                    //     initialPrompt,
                    //     select,
                    // } = this.stateManager.modalState;
                    // if (!activeTab && (initialPrompt || select)) {
                    //     event.stopImmediatePropagation();
                    //     event.preventDefault();
                    // }

                    // this.drawLinkManager.stopDrawing();
                    break;
            }
        }
    };

    public dispose() {
        this.saveStateLocally();
        this.disposeEvents();
    }
}
