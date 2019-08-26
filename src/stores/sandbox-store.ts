import NodeController from 'features/Sandbox/Node/node-controller';
import SandboxManager from 'features/Sandbox/Sandbox/sandbox-manager';
import { action, computed, observable } from 'mobx';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { NodeService } from 'services';
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
                    fullName: 'a node',
                    position: { x: 100, y: 100 },
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
        this.sandboxManager = new SandboxManager(
            this.onSelection,
            this.onPortDown
        );
    }

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
    public onPortDown = (element: HTMLDivElement, data: IPortData) => {
        console.log(element, data);
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
        this.dragEndObservable.clear();
        this.tabs = [];
    }
}
