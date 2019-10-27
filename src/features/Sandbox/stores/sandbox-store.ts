import { appStore } from 'app-state-store';
import localforage from 'localforage';
import { compose, Store } from 'overstated';
import { GraphService, MacroService, NodeService } from 'services';
import { userStore } from 'stores';
import { getGraphType, isMacro } from 'utils';
import { convertToSelectFriendly, flatten, getPort } from '../utils';
import { nodeDataToUINodeData } from './../utils';
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
    isLoadingDefinitions: boolean;
    isLoading: boolean;
}

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
        isLoading: false,
    };

    constructor() {
        super();
    }

    public initialize() {
        if (appStore.hasSelectedGraph) {
            this.tabsStore.addTab(appStore.state.selectedGraph!);
            appStore.setState({ selectedGraph: undefined });
        } else {
            this.tryLoadLocalState();
        }

        this.sandboxHeaderStore.graphHub.start();
        this.logsStore.terminalHub.start();

        if (this.tabsStore.hasActiveTab) {
            this.tabsStore.refreshActiveTab();
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

    public graphModifyOrCreate = (graph?: Graph | Macro, edit?: boolean) => {
        if (graph) {
            if (!edit) {
                this.tabsStore.addTab(graph);
            } else {
                this.tabsStore.updateTabData(graph);
            }
        }

        this.sandboxHeaderStore.setState({ modifyingGraphSettings: false });
    };

    public saveGraph = async () => {
        if (!this.tabsStore.hasActiveTab) {
            return;
        }

        this.sandboxHeaderStore.setState({ isSavingGraph: true });

        try {
            const data = this.getConvertedGraphData();
            if (isMacro(data)) {
                await MacroService.update(data);
            } else {
                await GraphService.update(data);
            }

            appStore.toast('Graph saved successfully!', 'success');
        } catch (e) {
            appStore.toast('Unable to save graph', 'error');
            console.error(e);
        }

        this.sandboxHeaderStore.setState({ isSavingGraph: false });
    };

    public load = async (graph: Graph | Macro) => {
        this.setState({ isLoading: true });

        const { nodes, links, id } = graph;
        const definitions = await this.loadDefinitions(
            id!,
            getGraphType(graph)
        );

        const uiNodes = (nodes || []).map<INodeUIData>(n => {
            const definition = definitions.definitionLookup[n.fullName];
            return nodeDataToUINodeData(n, definition);
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
        this.nodeSelectStore.toggleOpen(true);

        // this.hubManager.initialize();
        this.setState({ isLoading: false });
        this.sandboxHeaderStore.onTabLoaded();
    };

    public saveStateLocally = async () => {
        if (!userStore.isLoggedIn) {
            return;
        }

        const { tabs } = this.tabsStore.state;
        const graphInfo = tabs.map(x => ({
            id: x.graph.id,
            type: getGraphType(x.graph),
        }));
        await localforage.setItem(`${userStore.user!.id}-openTabs`, graphInfo);
    };

    public tryLoadLocalState = async () => {
        const graphInfo = await localforage.getItem<
            {
                id: string;
                type: GraphType;
            }[]
        >(`${userStore.user!.id}-openTabs`);

        if (graphInfo && graphInfo.any()) {
            this.suspend();
            for (const graph of graphInfo) {
                if (graph.type === 'graph') {
                    this.tabsStore.addTab(await GraphService.get(graph.id));
                } else {
                    this.tabsStore.addTab(await MacroService.get(graph.id));
                }
            }
            this.tabsStore.setActiveTab(graphInfo.firstOrDefault()!.id);
            this.unsuspend();
        } else {
            this.introStore.toggleStartPrompt(true);
        }

        await localforage.setItem(`${userStore.user!.id}-openTabs`, []);
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
            }
        } else {
            switch (event.keyCode) {
                case 27:
                    this.canvasStore.drawLinkStore.stopDraw();
                    break;
            }
        }
    };

    public getConvertedGraphData = (): Graph | Macro => {
        const { nodes, links } = this.canvasStore.state;
        const linkData = links.map<LinkData>(l => ({
            sourceNode: l.sourceNodeId,
            sourceKey: l.sourceData.id,
            destinationNode: l.destinationNodeId,
            destinationKey: l.destinationData.id,
        }));

        const nodeData = nodes.map<NodeData>(n => ({
            id: n.id,
            position: n.position,
            fullName: n.fullName,
            fieldData: n.valueInputs.map<FieldData>(f => ({
                key: f.id,
                value: f.value,
            })),
            permanent: n.permanent,
            macroFieldId: n.macroFieldId,
            macroId: n.macroId,
        }));

        const { graph } = this.tabsStore.activeTab;
        const { user } = userStore;

        return {
            ...graph,
            userId: user!.id,
            nodes: nodeData,
            links: linkData,
        };
    };

    public dispose() {
        this.saveStateLocally();
        this.disposeEvents();

        this.sandboxHeaderStore.graphHub.disconnect();
        this.logsStore.terminalHub.disconnect();
    }
}
