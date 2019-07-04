import { notification } from 'antd';
import { action, computed, observable, runInAction } from 'mobx';
import { ignore } from 'mobx-sync';
import { NodeService } from 'src/services';
import { graphStore, IDisposableStore, macroStore } from 'src/stores';
import { LinkImportExport } from './rete-engine/link';

import { getGraphType } from '@utils';
import _ from 'lodash';
import { isMacro } from 'src/utils/typeguards';
import GraphHub from './hubs/graph-hub';
import TerminalHub from './hubs/terminal-hub';
import { EditorImportExport, NodeEditor } from './rete-engine/editor';
import { NodeImportExport } from './rete-engine/node';

type LogType = 'log' | 'debug' | 'warn' | 'error';
export interface ILog {
    type: LogType;
    message: string;
    time: Date;
}

class EditorStore implements IDisposableStore {
    @ignore
    @computed
    get nodeDefinitionList(): NodeDefinition[] {
        return this.getNodeDefinitions(this.nodeDefinitions);
    }

    @ignore
    @observable
    public running: boolean = false;

    @ignore
    @observable
    public connected: boolean = false;

    @ignore
    @observable
    public saving: boolean = false;

    @ignore
    @observable
    public loadingDefinitions: boolean = false;

    @ignore
    @observable
    public loadingGraph: boolean = false;

    @ignore
    @observable
    public nodeDefinitions: IHierarchicalNode<NodeDefinition>;

    @ignore
    @observable
    public showLogs: boolean = false;

    @ignore
    private graphHub: GraphHub;
    @ignore
    private terminalHub: TerminalHub;

    @ignore
    @observable
    public logs: Array<ILog> = [];

    public nodeEditor: NodeEditor;

    constructor() {
        this.graphHub = new GraphHub();
        this.terminalHub = new TerminalHub();

        this.terminalHub.onLog(data => this.createLog(data, 'log'));
        this.terminalHub.onLogDebug(data => this.createLog(data, 'debug'));
        this.terminalHub.onLogWarn(data => this.createLog(data, 'warn'));
        this.terminalHub.onLogError(data => this.createLog(data, 'error'));
    }

    @action public async initialize() {
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

    @action public disconnect() {
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

    @action public async runGraph(graph: Graph | Macro) {
        await this.graphHub.attemptConnect();
        if (!isMacro(graph)) {
            await this.graphHub.runGraph(graph);
        } else {
            await this.graphHub.runMacro(
                graph,
                graph.flowInputs.firstOrDefault()!.key
            );
        }
        await this.graphHub.disconnect();
    }

    @action public runGraphFromEditor(
        graph: Graph | Macro,
        editorData: EditorImportExport,
        type: GraphType
    ) {
        try {
            if (!editorData.links.empty() && !editorData.nodes.empty()) {
                if (type === 'graph') {
                    const { nodes } = editorData;
                    this.graphHub.runGraph({
                        ...graph,
                        nodes: this.transformNodes(nodes),
                    });
                } else {
                    const { nodes } = editorData;
                    const macro = graph as Macro;
                    const { flowInputs } = macro;

                    this.graphHub.runMacro(
                        {
                            ...macro,
                            nodes: this.transformNodes(nodes),
                        },
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

    private transformNodes(nodes: NodeImportExport[]): NodeData[] {
        return nodes.map<NodeData>(x => ({
            id: x.id,
            macroFieldId: x.macroFieldId,
            macroId: x.macroId,
            fieldData: x.fieldData as FieldData[],
            fullName: x.fullName,
            position: { x: x.position[0], y: x.position[1] },
        }));
    }

    @action
    public async loadDefinitions(
        type: GraphType,
        graphId: string,
        forceRefresh: boolean
    ): Promise<void> {
        this.loadingDefinitions = true;

        let definitions: IHierarchicalNode<NodeDefinition>;

        try {
            definitions = await NodeService.getAllNodeDefinitions(
                graphId,
                type
            );

            if (forceRefresh || !_.isEqual(this.nodeDefinitions, definitions)) {
                runInAction(() => {
                    this.nodeDefinitions = definitions;
                    this.nodeEditor.trigger(
                        'onTreeRefresh',
                        definitions,
                        this.nodeDefinitionList
                    );
                });
            }
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingDefinitions = false;
            });
        }
    }

    public getDefinitionByNamespace = (fullName: string): NodeDefinition => {
        return this.nodeDefinitionList
            .filter(x => x.fullName === fullName)
            .firstOrDefault()!;
    };

    @action
    private createLog(data: string, type: LogType) {
        this.logs.push({
            message: data,
            time: new Date(),
            type,
        });
    }

    @action public async saveGraph(
        graph: Graph,
        nodes: Array<NodeData>,
        links: Array<LinkData>
    ) {
        this.saving = true;
        try {
            await graphStore.updateGraph({ ...graph, nodes, links });
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.saving = false;
            });
        }
    }

    @action public async saveMacro(
        macro: Macro,
        nodes: Array<NodeData>,
        links: Array<LinkData>
    ) {
        this.saving = true;
        try {
            await macroStore.updateMacro({
                ...macro,
                nodes,
                links,
            });
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.saving = false;
            });
        }
    }

    @action public dispose() {
        this.logs = [];
    }

    @action public closeLogDrawer() {
        this.showLogs = false;
    }

    @action public toggleLogDrawer() {
        this.showLogs = !this.showLogs;
    }

    @action public setLoadingGraph(toggle: boolean) {
        this.loadingGraph = toggle;
    }

    public setEditor(editor: NodeEditor) {
        this.nodeEditor = editor;
    }

    private getNodeDefinitions(
        node: IHierarchicalNode<NodeDefinition>
    ): NodeDefinition[] {
        const returnList: NodeDefinition[] = [];
        returnList.push(...node.items);
        Object.keys(node.children).forEach(c =>
            returnList.push(...this.getNodeDefinitions(node.children[c]))
        );
        return returnList;
    }
}

export default new EditorStore();

export { EditorStore };
