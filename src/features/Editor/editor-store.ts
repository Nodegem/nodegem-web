import { action, computed, observable, runInAction } from 'mobx';
import { UtilService, GraphService } from 'src/services';
import { ignore } from 'mobx-sync';
import { transformGraph } from './services/data-transform/run-graph';
import { EditorImportExport } from './rete-engine/editor';
import TerminalHub from './hubs/terminal-hub';
import GraphHub from './hubs/graph-hub';
import { notification } from 'antd';

class EditorStore {
    @computed get hasGraph() {
        return !!this.currentGraph;
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
    currentGraph?: Graph;

    @ignore
    @observable 
    loadingDefinitions: boolean = false;

    @observable
    nodeDefinitions: Array<NodeDefinition> = [];

    @ignore
    private graphHub: GraphHub;
    @ignore
    private terminalHub: TerminalHub;

    constructor() {
        this.graphHub = new GraphHub();
        this.terminalHub = new TerminalHub();
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

    @action dispose() {
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
                    message: "Unable to run graph",
                    description: "Nothing to run.",
                    placement: "bottomRight"
                })
            }
        } catch (e) {
            console.warn(e);
        }
    }

    @action
    async loadDefinitions() {
        this.loadingDefinitions = true;

        if (this.nodeDefinitions && this.nodeDefinitions.length > 0) {
            this.loadingDefinitions = false;
            return;
        }

        try {
            const definitions = await UtilService.getAllNodeDefinitions();
            runInAction(() => {
                this.nodeDefinitions = definitions;
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
        return this.nodeDefinitions
            .filter(x => x.fullName === fullName)
            .firstOrDefault()!;
    };

    getStartNodeDefinition = (): NodeDefinition => {
        return this.nodeDefinitions
            .filter(x => x.title.startsWith('Start'))
            .firstOrDefault()!;
    };

    @action async saveGraph(nodes: Array<NodeData>, links: Array<LinkData>) {
        this.saving = true;
        try {
            if(this.currentGraph) {
                const updatedGraph = await GraphService.update({ ...this.currentGraph, nodes, links });
                runInAction(() => {
                    this.currentGraph = updatedGraph;
                })
            }
        } catch(e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.saving = false;
            })
        }
    }

    @action setGraph(graph?: Graph) {
        this.currentGraph = graph;
    }
}

export default new EditorStore();

export { EditorStore };
