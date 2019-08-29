import DrawLinkController from 'features/Sandbox/Link/draw-link-controller';
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

    public drawLinkController: DrawLinkController;

    @observable
    public link?: { source: Vector2; destination: Vector2; type: PortType };

    @observable
    public sandboxManager: SandboxManager;

    @observable
    private _activeTab: string;

    @computed
    public get activeTab(): TabData | undefined {
        return this.tabs.firstOrDefault(x => x.graph.id === this._activeTab);
    }

    @computed
    public get nodeControllers(): NodeController[] {
        return this.sandboxManager.nodes;
    }

    @observable
    public nodeSelectClosed: boolean = false;

    @observable
    public nodeInfoClosed: boolean = true;

    constructor() {
        this.drawLinkController = new DrawLinkController(
            source => {
                const { x, y } = this.sandboxManager.convertCoordinates(
                    getCenterCoordinates(source.element)
                );
                this.link = {
                    source: { x, y },
                    destination: this.sandboxManager.mousePos,
                    type: source.data.type,
                };

                source.data.connected = true;
            },
            () => {
                this.link = {
                    source: this.link!.source,
                    destination: this.sandboxManager.mousePos,
                    type: this.link!.type,
                };
            },
            (s, d) => {
                this.link = undefined;
            }
        );

        this.sandboxManager = new SandboxManager(
            this.onSelection,
            this.onPortEvent
        );

        window.addEventListener('keyup', this.handleKeyPress);
    }

    @action
    private handleKeyPress = (event: KeyboardEvent) => {
        switch (event.keyCode) {
            case 32:
                this.sandboxManager.resetView();
                break;
            case 27:
                this.drawLinkController.stopDrawing();
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
    public loadDefinitions = (graphId: string, type: GraphType) => {
        return NodeService.getAllNodeDefinitions(graphId, type);
    };

    @action
    public onPortEvent = (
        event: PortEvent,
        element: HTMLDivElement,
        data: IPortData
    ) => {
        this.drawLinkController.toggleDraw(event, element, data);
    };

    @action
    public onSelection = (bounds: Bounds) => {
        console.log(bounds);
    };

    @action
    public loadNodes = (nodes: NodeData[]) => {
        this.sandboxManager.load(
            nodes!.map<INodeData>(x => ({
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
                    flowOutputs: [],
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
            this.loadNodes(nodes || []);
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
        this.drawLinkController.dispose();
        this.dragEndObservable.clear();
        this.sandboxManager.dispose();
        this.tabs = [];
        window.removeEventListener('keypress', this.handleKeyPress);
    }
}
