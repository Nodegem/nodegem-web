import { notification } from 'antd';
import { action, computed, observable, runInAction, toJS } from 'mobx';
import { ignore } from 'mobx-sync';
import { UtilService } from 'src/services';
import { graphStore, IDisposableStore } from 'src/stores';

import GraphHub from './hubs/graph-hub';
import TerminalHub from './hubs/terminal-hub';
import { EditorImportExport } from './rete-engine/editor';
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

    @computed get graph() {
        return graphStore.getGraphById(this.currentGraph);
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
    currentGraph: string;

    @ignore
    @observable
    loadingDefinitions: boolean = false;

    @observable
    nodeDefinitions: Array<NodeDefinition> = [];

    @observable
    lastRetrievedDefinitions: number;

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
    async loadDefinitions(force: boolean = false) {
        this.loadingDefinitions = true;

        if (!force && !this.shouldRefreshDefinitions()) {
            this.loadingDefinitions = false;
            return;
        }

        try {
            const definitions = await UtilService.getAllNodeDefinitions();
            runInAction(() => {
                this.nodeDefinitions = definitions;
                this.lastRetrievedDefinitions = new Date().getTime();
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

    private shouldRefreshDefinitions(): boolean {
        if (!this.lastRetrievedDefinitions) return true;
        if (!this.nodeDefinitions) return true;
        if (this.nodeDefinitions.length <= 0) return true;

        return (
            new Date().getTime() - this.lastRetrievedDefinitions >
            1000 * 60 * 30
        );
    }

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
                const graph = graphStore.getGraphById(this.currentGraph);
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

    @action setGraph(graph: string) {
        this.currentGraph = graph;
    }

    @action dispose() {
        this.currentGraph = '';
        this.logs = [];
    }

    @action showLogDrawer(show: boolean) {
        this.showLogs = show;
    }
}

export default new EditorStore();

export { EditorStore };
