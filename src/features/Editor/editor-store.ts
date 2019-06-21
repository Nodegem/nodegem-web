import { notification } from 'antd';
import { action, computed, observable, runInAction } from 'mobx';
import { ignore } from 'mobx-sync';
import { NodeService } from 'src/services';
import { graphStore, IDisposableStore, macroStore } from 'src/stores';

import GraphHub from './hubs/graph-hub';
import TerminalHub from './hubs/terminal-hub';
import { EditorImportExport, NodeEditor } from './rete-engine/editor';
import {
    transformGraph,
    transformMacro,
} from './services/data-transform/run-graph';
import { isMacro } from 'src/utils/typeguards';

type LogType = 'log' | 'warn' | 'error';
export type Log = {
    type: LogType;
    message: string;
    time: Date;
};

class EditorStore implements IDisposableStore {
    @ignore
    @computed
    get graph(): Graph | Macro {
        const { graphId } = this;
        return (
            graphStore.getGraphById(graphId) ||
            macroStore.getMacroById(graphId)!
        );
    }

    @ignore
    @computed
    get nodeDefinitionList(): NodeDefinition[] {
        return this.getNodeDefinitions(this.nodeDefinitions);
    }

    get graphExists(): boolean {
        return !!this.graphId;
    }

    get graphType(): GraphType {
        const { graph } = this;
        return isMacro(graph) ? 'macro' : 'graph';
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

    @ignore
    @observable
    loadingDefinitions: boolean = false;

    @observable
    nodeDefinitions: IHierarchicalNode<NodeDefinition>;

    @observable
    graphId: string;

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
            await this.graphHub.attemptConnect();
            await this.terminalHub.attemptConnect();
            runInAction(() => {
                this.connected = true;
            });
        } catch (e) {
            console.warn(e);
        }
    }

    @action disconnect() {
        try {
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

    @action runGraph(editorData: EditorImportExport, type: GraphType) {
        try {
            if (!editorData.links.empty() && !editorData.nodes.empty()) {
                if (type === 'graph') {
                    const graphData = transformGraph(editorData);
                    this.graphHub.runGraph(graphData);
                } else {
                    const macro = this.graph as Macro;
                    const {
                        flowInputs,
                        flowOutputs,
                        valueInputs,
                        valueOutputs,
                    } = macro;
                    const macroData = transformMacro({
                        ...editorData,
                        flowInputs,
                        flowOutputs,
                        valueInputs,
                        valueOutputs,
                    });
                    this.graphHub.runMacro(
                        macroData,
                        flowInputs.firstOrDefault()!.key
                    );
                }
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
            if (this.graphId) {
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
            if (this.graphId) {
                const macro = this.graph as Macro;
                if (macro) {
                    await macroStore.updateMacro({
                        ...macro,
                        nodes,
                        links,
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

    @action setGraph(graph: string) {
        this.graphId = graph;
    }

    @action dispose() {
        this.graphId = '';
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
