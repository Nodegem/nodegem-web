import SandboxManager from 'features/Sandbox/Sandbox/sandbox-manager';
import { action, computed, observable } from 'mobx';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { NodeService } from 'services';
import { SimpleObservable } from './../utils/simple-observable';

let fake = 0;

export type DragEndProps = { result: DropResult; provided: ResponderProvided };
export type TabData = {
    graph: Graph | Macro;
};

export class SandboxStore implements IDisposable {
    @observable
    public tabs: TabData[] = [];

    public dragEndDisposable: SimpleObservable<
        DragEndProps
    > = new SimpleObservable();

    public sandboxManager: SandboxManager = new SandboxManager();

    @observable
    private _activeTab: string;

    @computed
    public get activeTab(): TabData | undefined {
        return this.tabs.firstOrDefault(x => x.graph.id === this._activeTab);
    }

    @observable
    public nodeSelectClosed: boolean = false;

    @observable
    public nodeInfoClosed: boolean = true;

    @action
    public toggleNodeInfo() {
        this.nodeInfoClosed = !this.nodeInfoClosed;
    }

    @action
    public toggleNodeSelect() {
        this.nodeSelectClosed = !this.nodeSelectClosed;
    }

    @action
    public loadDefinitions(graphId: string, type: GraphType) {
        return NodeService.getAllNodeDefinitions(graphId, type);
    }

    @action
    public setActiveTab = (id: string) => {
        this._activeTab = id;
    };

    @action
    public reorderTabs = (tabs: TabData[]) => {
        this.tabs = tabs;
    };

    @action
    public addTab = () => {
        const id = fake.toString();
        if (this.tabs.some(x => x.graph.id === id)) {
            return;
        }

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
        this.dragEndDisposable.clear();
        this.tabs = [];
    }
}
