import DrawLinkController from 'features/Sandbox/Link/draw-link-controller';
import FakeLinkController from 'features/Sandbox/Link/fake-link-controller';
import LinkController from 'features/Sandbox/Link/link-controller';
import NodeController from 'features/Sandbox/Node/node-controller';
import SandboxManager from 'features/Sandbox/Sandbox/sandbox-manager';
import { action, computed, observable, runInAction } from 'mobx';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { NodeService } from 'services';
import { getCenterCoordinates } from 'utils';
import { SimpleObservable } from './../utils/simple-observable';

let fake = 1;

export type DragEndProps = { result: DropResult; provided: ResponderProvided };
export type TabData = {
    graph: Partial<Graph | Macro>;
};

export const testData: TabData[] = [
    {
        graph: {
            id: '0',
            name: 'test',
            nodes: [
                {
                    id: '0',
                    fullName: 'A',
                    position: { x: 0, y: -50 },
                },
                {
                    id: '1',
                    fullName: 'B',
                    position: { x: 0, y: 50 },
                },
            ],
            links: [
                {
                    sourceNode: '0',
                    sourceKey: '0',
                    destinationNode: '1',
                    destinationKey: '1',
                },
            ],
            description: 'a test one',
        },
    },
];

export class SandboxStore implements IDisposable {
    @observable
    public tabs: TabData[] = [];

    public dragEndObservable: SimpleObservable<
        DragEndProps
    > = new SimpleObservable();

    private _drawLinkController: DrawLinkController;

    public fakeLink: FakeLinkController;

    @observable
    public isDrawing: boolean = false;

    @observable
    public sandboxManager: SandboxManager;

    @observable
    private _activeTab: string;

    @computed
    public get activeTab(): TabData | undefined {
        return this.tabs.firstOrDefault(x => x.graph.id === this._activeTab);
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
            source => {
                const start = this.sandboxManager.convertCoordinates(
                    getCenterCoordinates(source.element)
                );

                this.isDrawing = true;
                this.fakeLink.begin(start, source.data.type);

                source.data.connected = true;
            },
            () => {
                this.fakeLink.update(this.sandboxManager.mousePos);
            },
            (s, d) => {
                if (s && d) {
                    this.sandboxManager.addLink(s, d);
                } else if (s) {
                    s.data.connected = false;
                }

                this.fakeLink.stop();
                this.isDrawing = false;
            }
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
    public toggleNodeInfo = () => {
        this.nodeInfoClosed = !this.nodeInfoClosed;
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
    public loadDefinitions = (graphId: string, type: GraphType) => {
        return NodeService.getAllNodeDefinitions(graphId, type);
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
    public load = (nodes: NodeData[]) => {
        this.sandboxManager.load(
            nodes!.map<INodeUIData>(x => ({
                id: x.id,
                title: x.fullName,
                portData: {
                    flowInputs: [
                        {
                            id: '0',
                            name: 'test',
                            type: 'flow',
                            connected: false,
                        },
                    ],
                    valueInputs: [],
                    flowOutputs: [
                        {
                            id: '0',
                            name: 'test',
                            type: 'flow',
                            connected: false,
                        },
                    ],
                    valueOutputs: [],
                },
                position: x.position,
            }))
        );
    };

    @action
    public setActiveTab = (id: string) => {
        this._activeTab = id;
        if (this.activeTab) {
            const { nodes } = this.activeTab.graph;
            this.load(nodes || []);
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
    public addTab = () => {
        const id = fake.toString();

        this.tabs.push({
            graph: { id, name: id } as any,
        });

        this.setActiveTab(id);
        fake++;
    };

    @action
    public deleteTab = (graphId: string) => {
        this.tabs.removeWhere(x => x.graph.id === graphId);
    };

    public dispose(): void {
        this.fakeLink.dispose();
        this._drawLinkController.dispose();
        this.dragEndObservable.clear();
        this.sandboxManager.dispose();
        this.tabs = [];
        window.removeEventListener('keypress', this.handleKeyPress);
    }
}
