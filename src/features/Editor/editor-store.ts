import { notification } from 'antd';
import { action, computed, observable, runInAction, toJS } from 'mobx';
import { ignore } from 'mobx-sync';
import { NodeService } from 'src/services';
import { graphStore, IDisposableStore, macroStore } from 'src/stores';

import GraphHub from './hubs/graph-hub';
import TerminalHub from './hubs/terminal-hub';
import { EditorImportExport, NodeEditor } from './rete-engine/editor';
import { transformGraph } from './services/data-transform/run-graph';

type LogType = 'log' | 'warn' | 'error';
export type Log = {
    type: LogType;
    message: string;
    time: Date;
};

class EditorStore implements IDisposableStore {
    @computed get hasGraph() {
        return !!this.currentGraph;
    }

    @computed get graph(): Graph | Macro | undefined {
        const currentGraphId =
            (this.currentGraph && this.currentGraph.id) || '';
        let returnGraph;
        returnGraph = graphStore.getGraphById(currentGraphId);

        if (!returnGraph) {
            returnGraph = macroStore.getMacroById(currentGraphId);
        }

        return returnGraph;
    }

    @ignore
    @observable
    running: boolean = false;

    @ignore
    @observable
    connected: boolean = false;

    @ignore
    @observable
    saving: boolean = false;

    @observable
    currentGraph: { id: string; type: GraphType } | undefined;

    @ignore
    @observable
    loadingDefinitions: boolean = false;

    @observable
    nodeDefinitions: IHierarchicalNode<NodeDefinition>;

    @ignore
    @computed
    get nodeDefinitionList(): NodeDefinition[] {
        return this.getNodeDefinitions(this.nodeDefinitions);
    }

    @ignore
    @observable
    showLogs: boolean = false;

    @ignore
    private graphHub: GraphHub;
    @ignore
    private terminalHub: TerminalHub;

    @ignore
    @observable
    logs: Array<Log> = [];

    nodeEditor: NodeEditor;

    constructor() {
        this.graphHub = new GraphHub();
        this.terminalHub = new TerminalHub();

        this.terminalHub.onLog(data => this.createLog(data, 'log'));
        this.terminalHub.onLogWarn(data => this.createLog(data, 'warn'));
        this.terminalHub.onLogError(data => this.createLog(data, 'error'));
    }

    @action async initialize() {
        try {
            await this.graphHub.start();
            await this.terminalHub.start();
            runInAction(() => {
                this.connected = true;
            });
        } catch (e) {
            console.warn(e);
        }
    }

    @action disconnect() {
        try {
            this.terminalHub.disconnect();
            this.graphHub.disconnect();

            this.terminalHub.dispose();
            this.graphHub.dispose();
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.connected = false;
            });
        }
    }

    @action runGraph(editorData: EditorImportExport) {
        try {
            const graphData = transformGraph(editorData);
            if (!graphData.links.empty() || !graphData.nodes.empty()) {
                this.graphHub.runGraph(graphData);
            } else {
                notification.warn({
                    message: 'Unable to run graph',
                    description: 'Nothing to run.',
                    placement: 'bottomRight',
                });
            }
        } catch (e) {
            console.warn(e);
        }
    }

    @action
    async loadDefinitions(type: GraphType, graphId: string): Promise<void> {
        this.loadingDefinitions = true;

        let definitions = this.nodeDefinitions;

        try {
            definitions = await NodeService.getAllNodeDefinitions(
                graphId,
                type
            );
            runInAction(() => {
                this.nodeDefinitions = definitions;
                this.nodeEditor.trigger(
                    'onTreeRefresh',
                    definitions,
                    this.nodeDefinitionList
                );
            });
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingDefinitions = false;
            });
        }
    }

    getDefinitionByNamespace = (fullName: string): NodeDefinition => {
        return this.nodeDefinitionList
            .filter(x => x.fullName === fullName)
            .firstOrDefault()!;
    };

    @action
    private createLog(data: string, type: LogType) {
        this.logs.push({
            message: data,
            time: new Date(),
            type: type,
        });
    }

    @action async saveGraph(nodes: Array<NodeData>, links: Array<LinkData>) {
        this.saving = true;
        try {
            if (this.currentGraph) {
                const graph = this.graph;
                if (graph) {
                    await graphStore.updateGraph({ ...graph, nodes, links });
                }
            }
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.saving = false;
            });
        }
    }

    @action async saveMacro(nodes: Array<NodeData>, links: Array<LinkData>) {
        this.saving = true;
        try {
            if (this.currentGraph) {
                const macro = this.graph;
                if (macro) {
                    await macroStore.updateMacro({
                        ...macro,
                        nodes,
                        links,
                        flowInputs: [],
                        flowOutputs: [],
                        valueInputs: [],
                        valueOutputs: [],
                    });
                }
            }
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.saving = false;
            });
        }
    }

    @action setGraph(graph: string, type: GraphType) {
        this.currentGraph = { id: graph, type };
    }

    @action dispose() {
        this.currentGraph = undefined;
        this.logs = [];
    }

    @action closeLogDrawer() {
        this.showLogs = false;
    }

    @action toggleLogDrawer() {
        this.showLogs = !this.showLogs;
    }

    setEditor(editor: NodeEditor) {
        this.nodeEditor = editor;
    }

    private getNodeDefinitions(
        node: IHierarchicalNode<NodeDefinition>
    ): NodeDefinition[] {
        let returnList: NodeDefinition[] = [];
        returnList.push(...node.items);
        Object.keys(node.children).forEach(c =>
            returnList.push(...this.getNodeDefinitions(node.children[c]))
        );
        return returnList;
    }
}

export default new EditorStore();

export { EditorStore };
