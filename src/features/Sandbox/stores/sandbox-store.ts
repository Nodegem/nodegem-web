import localforage from 'localforage';
import { compose, Store } from 'overstated';
import { GraphService, MacroService, NodeService } from 'services';
import { appStore } from 'stores';
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
import _ from 'lodash';

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

    public async initialize() {
        if (appStore.hasSelectedGraph) {
            this.tabsStore.addTab(appStore.state.selectedGraph!);
            appStore.setState({ selectedGraph: undefined });
        } else {
            this.tryLoadLocalState();
        }

        this.sandboxHeaderStore.graphHub.start();
        this.logsStore.terminalHub.start();

        await this.sandboxHeaderStore.initialize();

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

    public graphModifiedOrCreated = (graph?: Graph | Macro) => {
        if (graph) {
            if (!this.introStore.state.graphToEdit) {
                this.tabsStore.addTab(graph);
            } else {
                const currentGraph = this.getConvertedGraphData();
                const updatedGraph = {
                    ...graph,
                    nodes: currentGraph.nodes,
                    links: currentGraph.links,
                };
                this.tabsStore.updateTabData(updatedGraph);
            }
        }

        this.introStore.setState({
            graphToEdit: undefined,
            isGraphModalOpen: false,
            isMacroModalOpen: false,
        });
    };

    public saveGraph = async () => {
        if (!this.tabsStore.hasActiveTab) {
            return;
        }

        this.suspend();
        this.sandboxHeaderStore.setState({ isSavingGraph: true });
        this.setState({ isLoading: true });

        try {
            const data = this.getConvertedGraphData();
            if (isMacro(data)) {
                await MacroService.update(data);
                appStore.toast('Macro saved successfully!', 'success');
            } else {
                await GraphService.update(data);
                appStore.toast('Graph saved successfully!', 'success');
            }

            this.tabsStore.updateTabData(data);
        } catch (e) {
            appStore.toast('Unable to save graph/macro', 'error');
            console.error(e);
        }

        this.setState({ isLoading: false });
        this.sandboxHeaderStore.setState({ isSavingGraph: false });
        this.unsuspend();
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

        this.setState({ isLoading: false });
        this.sandboxHeaderStore.onTabLoaded();
    };

    public saveStateLocally = async () => {
        if (!appStore.userStore.isLoggedIn) {
            return;
        }

        const { tabs } = this.tabsStore.state;
        const graphInfo = tabs.map(x => ({
            id: x.initial.id,
            type: getGraphType(x.initial),
        }));
        await localforage.setItem(
            `${appStore.userStore.user.id}-openTabs`,
            graphInfo
        );
    };

    public tryLoadLocalState = async () => {
        const graphInfo = await localforage.getItem<
            {
                id: string;
                type: GraphType;
            }[]
        >(`${appStore.userStore.user.id}-openTabs`);

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

        await localforage.setItem(`${appStore.userStore.user.id}-openTabs`, []);
    };

    private listenToKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey || event.metaKey) {
            console.log(event);
            switch (event.keyCode) {
                case 83:
                    event.preventDefault();
                    this.saveGraph();
                    break;
                case 32:
                    this.canvasStore.resetView();
                    break;
                case 70:
                    event.preventDefault();
                    this.nodeSelectStore.focusInput();
                    break;
            }
        } else {
            switch (event.keyCode) {
                case 27:
                    this.canvasStore.drawLinkStore.stopDraw();
                    break;
                case 46:
                    this.canvasStore.deleteSelectedNodes();
                    break;
            }
        }
    };

    public getConvertedGraphData = (
        skipOrphanedNodes: boolean = false
    ): Graph | Macro => {
        const { nodes, links } = this.canvasStore.state;
        const linkData = links.map<LinkData>(l => ({
            sourceNode: l.sourceNodeId,
            sourceKey: l.sourceData.id,
            destinationNode: l.destinationNodeId,
            destinationKey: l.destinationData.id,
        }));

        const allNodeData = skipOrphanedNodes
            ? nodes.filter(x => this.canvasStore.getNode(x.id)!.links.any())
            : nodes;

        const nodeData = allNodeData.map<NodeData>(n => ({
            id: n.id,
            position: n.position,
            fullName: n.fullName,
            fieldData: [
                ...n.valueInputs,
                ...n.valueOutputs.filter(x => x.indefinite),
                ...n.flowOutputs.filter(x => x.indefinite),
            ].map<FieldData>(f => ({
                key: f.id,
                value: f.value,
                valueType: f.valueType || 'any',
            })),
            permanent: n.permanent,
            macroFieldId: n.macroFieldId,
            macroId: n.macroId,
        }));

        const { graph } = this.tabsStore.activeTab;
        const { user } = appStore.userStore;

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
