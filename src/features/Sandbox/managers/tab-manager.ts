import { action, computed, observable } from 'mobx';

export class TabManager implements IDisposable {
    @observable
    public tabs: TabData[] = [];

    @computed
    public get activeTab(): TabData | undefined {
        return this.tabs.firstOrDefault(x => x.graph.id === this._activeTab);
    }

    @computed
    public get hasTabs(): boolean {
        return !this.tabs.empty();
    }

    @computed
    public get hasActiveTab(): boolean {
        return !!this._activeTab;
    }

    @observable
    private _activeTab: string;

    constructor(
        private onTabActivated: (tab: TabData) => void,
        private onTabDeleted: (isEmpty: boolean) => void
    ) {}

    @action
    public setActiveTab = (id: string) => {
        if (this._activeTab && id === this._activeTab) {
            return;
        }

        this._activeTab = id;
        if (this.activeTab) {
            this.onTabActivated(this.activeTab);
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
    public editTab = (graph: Graph | Macro) => {
        if (this.activeTab) {
            this.activeTab.graph = graph;
        }
    };

    @action
    public deleteTab = (graphId: string) => {
        const index = this.tabs.findIndex(x => x.graph.id === graphId);
        this.tabs.removeWhere(x => x.graph.id === graphId);
        if (index >= 0) {
            let isEmpty = false;
            if (index - 1 >= 0) {
                const nextTab = this.tabs[index - 1];
                this.setActiveTab(nextTab.graph.id!);
            } else if (this.tabs.length > 0) {
                const nextTab = this.tabs[index];
                this.setActiveTab(nextTab.graph.id!);
            } else {
                isEmpty = true;
                this.clearTabs();
            }
            this.onTabDeleted(isEmpty);
        }
    };

    @action
    public clearTabs = () => {
        this.tabs = [];
        this._activeTab = '';
    };

    public dispose(): void {
        this.clearTabs();
    }
}
