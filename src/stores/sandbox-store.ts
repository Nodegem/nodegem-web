import { message } from 'antd';
import DrawLinkController from 'features/Sandbox/Link/draw-link-controller';
import FakeLinkController from 'features/Sandbox/Link/fake-link-controller';
import LinkController from 'features/Sandbox/Link/link-controller';
import NodeController from 'features/Sandbox/Node/node-controller';
import SandboxManager from 'features/Sandbox/Sandbox/sandbox-manager';
import { flatten, getPort, isValidConnection } from 'features/Sandbox/utils';
import { action, computed, observable } from 'mobx';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { NodeService } from 'services';
import { getCenterCoordinates, getGraphType, isMacro } from 'utils';
import { DrawArgs } from './../features/Sandbox/Link/draw-link-controller';
import { convertToSelectFriendly } from './../features/Sandbox/utils';
import { SimpleObservable } from './../utils/simple-observable';

export type DragEndProps = { result: DropResult; provided: ResponderProvided };
export type TabData = {
    graph: Partial<Graph | Macro>;
};

type NodeCache = {
    definitions: IHierarchicalNode<NodeDefinition>;
    definitionList: NodeDefinition[];
    definitionLookup: { [id: string]: NodeDefinition };
    selectFriendly: SelectFriendly<NodeDefinition>;
};

export class SandboxStore implements IDisposable {
    @observable
    private _cachedDefinitions: {
        [graphId: string]: NodeCache;
    } = {};

    @observable
    public loadingGraph: boolean = false;

    @observable
    public loadingDefinitions: boolean = false;

    @observable
    public tabs: TabData[] = [];

    public dragEndObservable: SimpleObservable<
        DragEndProps
    > = new SimpleObservable();

    private _drawLinkController: DrawLinkController;

    public modifiedLink?: {
        link: LinkController;
        startElement: HTMLElement;
    };
    public fakeLink: FakeLinkController;

    @observable
    public isDrawing: boolean = false;

    @observable
    public sandboxManager: SandboxManager;

    @observable
    private _activeTab: string;

    @observable
    public selectionModalVisible: boolean = false;

    @observable
    public selectGraphVisible: boolean = false;

    @computed
    public get activeTab(): TabData | undefined {
        return this.tabs.firstOrDefault(x => x.graph.id === this._activeTab);
    }

    @computed
    public get nodeDefinitionOptions(): NodeCache {
        return (
            (this._activeTab && this._cachedDefinitions[this._activeTab]) || {
                definitionList: [],
                definitionLookup: {},
                definitions: {} as IHierarchicalNode<NodeDefinition>,
                selectFriendly: {},
            }
        );
    }

    @computed
    public get hasTabs(): boolean {
        return !this.tabs.empty();
    }

    @computed
    public get hasActiveTab(): boolean {
        return !!this._activeTab;
    }

    @computed
    public get nodes(): NodeController[] {
        return this.sandboxManager.nodes;
    }

    @computed
    public get links(): LinkController[] {
        return this.sandboxManager.links;
    }

    @observable
    public nodeSelectClosed: boolean = false;

    @observable
    public nodeInfoClosed: boolean = true;

    @observable
    public logsClosed: boolean = true;

    @observable
    public linksVisible: boolean = true;

    constructor() {
        this._drawLinkController = new DrawLinkController(
            this.handleDrawStart,
            () => this.fakeLink.update(this.sandboxManager.mousePos),
            this.handleDrawEnd
        );

        this.sandboxManager = new SandboxManager(
            this.onSelection,
            this.onPortEvent,
            this.handleCanvasDown,
            this.handleNodeDblClick
        );

        this.fakeLink = new FakeLinkController();

        window.addEventListener('keyup', this.handleKeyPress);
    }

    @action
    private handleKeyPress = (event: KeyboardEvent) => {
        switch (event.keyCode) {
            case 32:
                this.sandboxManager.resetView();
                break;
            case 27:
                this._drawLinkController.stopDrawing();
                break;
        }
    };

    @action
    private handleNodeDblClick = (node: NodeController) => {
        this.toggleNodeInfo(false);
    };

    private handleCanvasDown = (event: MouseEvent) => {
        if (this._drawLinkController.isDrawing) {
            this._drawLinkController.stopDrawing();
        }
    };

    @action
    public toggleSelectionModal = (value?: boolean) => {
        this.selectionModalVisible =
            value === undefined ? !this.selectionModalVisible : value;
    };

    @action
    public toggleGraphSelectModal = (value?: boolean) => {
        this.selectGraphVisible =
            value === undefined ? !this.selectGraphVisible : value;
    };

    @action
    public toggleNodeInfo = (value?: boolean) => {
        this.nodeInfoClosed =
            value === undefined ? !this.nodeInfoClosed : value;
    };

    @action
    public toggleNodeSelect = () => {
        this.nodeSelectClosed = !this.nodeSelectClosed;
    };

    @action
    public toggleLogs = (value?: boolean) => {
        this.logsClosed = value === undefined ? !this.logsClosed : value;
    };

    @action
    public toggleLinkVisibility = () => {
        this.linksVisible = !this.linksVisible;
    };

    @action
    public loadDefinitions = async (
        graphId: string,
        type: GraphType,
        forceRefresh?: boolean
    ) => {
        this.loadingDefinitions = true;
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
        this.loadingDefinitions = false;
        return this._cachedDefinitions[graphId];
    };

    @action
    public onNodeEdit = (node: INodeUIData) => {
        this.toggleNodeInfo(false);
    };

    @action
    public onPortEvent = (
        event: PortEvent,
        element: HTMLDivElement,
        data: IPortUIData,
        node: NodeController
    ) => {
        this._drawLinkController.toggleDraw(event, element, data, node);
    };

    @action
    public onSelection = (bounds: Bounds) => {
        console.log(bounds);
    };

    @action
    public load = async (graph: Partial<Graph | Macro>) => {
        this.loadingGraph = true;

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
                position: n.position,
                description: info.description,
                portData: {
                    flowInputs: (flowInputs || []).map<IPortUIData>(fi => ({
                        id: fi.key,
                        name: fi.label,
                        io: 'input',
                        type: 'flow',
                        data:
                            n.fieldData &&
                            n.fieldData.firstOrDefault(x => x.key === fi.key),
                    })),
                    flowOutputs: (flowOutputs || []).map<IPortUIData>(fo => ({
                        id: fo.key,
                        name: fo.label,
                        io: 'output',
                        type: 'flow',
                        data:
                            n.fieldData &&
                            n.fieldData.firstOrDefault(x => x.key === fo.key),
                    })),
                    valueInputs: (valueInputs || []).map<IPortUIData>(vi => ({
                        id: vi.key,
                        name: vi.label,
                        io: 'input',
                        type: 'value',
                        valueType: vi.valueType,
                        defaultValue: vi.defaultValue,
                        data:
                            n.fieldData &&
                            n.fieldData.firstOrDefault(x => x.key === vi.key),
                    })),
                    valueOutputs: (valueOutputs || []).map<IPortUIData>(vo => ({
                        id: vo.key,
                        name: vo.label,
                        io: 'output',
                        type: 'value',
                        data:
                            n.fieldData &&
                            n.fieldData.firstOrDefault(x => x.key === vo.key),
                    })),
                },
                title: info.title,
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

        this.sandboxManager.load(uiNodes, uiLinks);

        this.loadingGraph = false;
    };

    @action
    public setActiveTab = (id: string) => {
        this._activeTab = id;
        if (this.activeTab) {
            this.load(this.activeTab.graph);
        }
    };

    @action
    public setTabs = (tabs: TabData[], setActiveTab = false) => {
        this.tabs = tabs;
        if (setActiveTab && !tabs.empty()) {
            this.setActiveTab(tabs.firstOrDefault()!.graph.id!);
        }
    };

    @action
    public addTab = (graph: Graph | Macro) => {
        this.tabs.push({ graph });
        this.setActiveTab(graph.id);
    };

    @action
    public deleteTab = (graphId: string) => {
        const index = this.tabs.findIndex(x => x.graph.id === graphId);
        this.tabs.removeWhere(x => x.graph.id === graphId);
        if (index >= 0) {
            if (index - 1 >= 0) {
                const nextTab = this.tabs[index - 1];
                this.setActiveTab(nextTab.graph.id!);
            } else if (this.tabs.length > 0) {
                const nextTab = this.tabs[index + 1];
                this.setActiveTab(nextTab.graph.id!);
            } else {
                this.sandboxManager.clearView();
            }
            this.toggleSelectionModal(false);
            this.toggleGraphSelectModal(false);
        }
    };

    public dispose(): void {
        this.fakeLink.dispose();
        this._drawLinkController.dispose();
        this.dragEndObservable.clear();
        this.sandboxManager.dispose();
        window.removeEventListener('keypress', this.handleKeyPress);
        this.tabs = [];
        this.toggleSelectionModal(false);
        this.toggleGraphSelectModal(false);
        this._activeTab = '';
    }

    private onGraphError = (
        msg: string,
        type: 'warning' | 'error' = 'warning'
    ) => {
        if (type === 'warning') {
            message.warning(msg, 2);
        } else {
            message.error(msg, 2);
        }
    };

    private handleDrawStart = (source: DrawArgs) => {
        let startElement = source.element;
        if (
            source.data.connected &&
            !(source.data.io === 'output' && source.data.type === 'value')
        ) {
            const link = this.sandboxManager.getLinkByNode(
                source.node.id,
                source.data.id
            );

            if (link) {
                startElement = link.getOppositePortElement(source.element);
                this.sandboxManager.removeLink(link.id);
                link.toggleConnectingOppositePort(source.element);

                this.modifiedLink = {
                    link,
                    startElement,
                };
            }
        } else {
            source.data.connecting = true;
        }

        const start = this.sandboxManager.convertCoordinates(
            getCenterCoordinates(startElement)
        );

        this.isDrawing = true;
        this.fakeLink.begin(start, source.data.type);
        this.fakeLink.update(this.sandboxManager.mousePos);
    };

    private handleDrawEnd = (s: DrawArgs, d: DrawArgs) => {
        if (s && d) {
            if (this.modifiedLink) {
                const { link, startElement } = this.modifiedLink;
                const start = {
                    element: startElement,
                    data: link.getSourceData(startElement),
                    node: this.sandboxManager.getNode(
                        link.getSourceNodeId(startElement)
                    )!,
                };
                const destination =
                    s === d
                        ? {
                              element: link.getOppositePortElement(
                                  startElement
                              ),
                              data: link.getOppositeData(startElement),
                              node: this.sandboxManager.getNode(
                                  link.getOppositeNodeId(startElement)
                              )!,
                          }
                        : d;

                if (
                    isValidConnection(
                        { nodeId: start.node.id, port: start.data },
                        {
                            nodeId: destination.node.id,
                            port: destination.data,
                        }
                    )
                ) {
                    this.sandboxManager.addLink(start, destination);
                } else {
                    this.onGraphError('Not a valid connection');
                    link.dispose();
                }
            } else {
                if (
                    isValidConnection(
                        { nodeId: s.node.id, port: s.data },
                        { nodeId: d.node.id, port: d.data }
                    )
                ) {
                    this.sandboxManager.addLink(s, d);
                } else {
                    this.onGraphError('Not a valid connection');
                }
            }
            s.data.connecting = false;
            d.data.connecting = false;
        } else if (s) {
            s.data.connecting = false;
            if (this.modifiedLink) {
                const { link } = this.modifiedLink;
                link.dispose();
            }
        }

        this.fakeLink.stop();
        this.isDrawing = false;
        this.modifiedLink = undefined;
    };
}
