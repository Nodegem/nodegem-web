import { message } from 'antd';
import DrawLinkController from 'features/Sandbox/Link/draw-link-controller';
import FakeLinkController from 'features/Sandbox/Link/fake-link-controller';
import LinkController from 'features/Sandbox/Link/link-controller';
import NodeController from 'features/Sandbox/Node/node-controller';
import SandboxManager from 'features/Sandbox/Sandbox/sandbox-manager';
import { flatten, isValidConnection } from 'features/Sandbox/utils';
import { action, computed, observable } from 'mobx';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { NodeService } from 'services';
import { getCenterCoordinates, getGraphType, isMacro } from 'utils';
import { DrawArgs } from './../features/Sandbox/Link/draw-link-controller';
import { SimpleObservable } from './../utils/simple-observable';

export type DragEndProps = { result: DropResult; provided: ResponderProvided };
export type TabData = {
    graph: Partial<Graph | Macro>;
};

export class SandboxStore implements IDisposable {
    private _cachedDefinitions: {
        [graphId: string]: IHierarchicalNode<NodeDefinition>;
    } = {};

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
    public modalVisible: boolean = false;

    @computed
    public get activeTab(): TabData | undefined {
        return this.tabs.firstOrDefault(x => x.graph.id === this._activeTab);
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
    public linksVisible: boolean = true;

    constructor() {
        this._drawLinkController = new DrawLinkController(
            this.handleDrawStart,
            () => this.fakeLink.update(this.sandboxManager.mousePos),
            this.handleDrawEnd
        );

        this.sandboxManager = new SandboxManager(
            this.onSelection,
            this.onPortEvent
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
    public toggleModal = () => {
        this.modalVisible = !this.modalVisible;
    };

    @action
    public toggleNodeInfo = (value?: boolean) => {
        if (value === undefined) {
            value = !this.nodeInfoClosed;
        }
        this.nodeInfoClosed = value;
    };

    @action
    public toggleNodeSelect = () => {
        this.nodeSelectClosed = !this.nodeSelectClosed;
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
        let definitions: IHierarchicalNode<NodeDefinition>;

        if (!forceRefresh && this._cachedDefinitions[graphId]) {
            definitions = this._cachedDefinitions[graphId];
        } else {
            definitions = await NodeService.getAllNodeDefinitions(
                graphId,
                type
            );
            this._cachedDefinitions[graphId] = definitions;
        }

        return definitions;
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
        const { nodes, links, id } = graph;
        const definitions = flatten(
            await this.loadDefinitions(id!, getGraphType(graph))
        );

        console.log(definitions);

        const uiNodes = (nodes || []).map<INodeUIData>(n => {
            return {
                id: n.id,
                position: n.position,
                portData: {
                    flowInputs: [],
                    flowOutputs: [],
                    valueInputs: [],
                    valueOutputs: [],
                },
                title: 's',
            };
        });

        this.sandboxManager.load(uiNodes);
    };

    @action
    public setActiveTab = (id: string) => {
        this._activeTab = id;
        if (this.activeTab) {
            const { nodes } = this.activeTab.graph;
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
            this.tabs.removeWhere(x => x.graph.id === graphId);
        }
    };

    public dispose(): void {
        this.fakeLink.dispose();
        this._drawLinkController.dispose();
        this.dragEndObservable.clear();
        this.sandboxManager.dispose();
        this.tabs = [];
        window.removeEventListener('keypress', this.handleKeyPress);
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
