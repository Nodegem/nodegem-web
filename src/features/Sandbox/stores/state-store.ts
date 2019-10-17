import { Store } from 'overstated';
import { SandboxStore } from '.';
import { appStateContainer } from './../../../app-state-store';

interface ISandboxState {
    isActive: boolean;
    tabs: TabData[];
    activeTabId: string;
    activeGraph?: Graph | Macro;
    edittingSettings: boolean;
}

export class StateStore extends Store<ISandboxState, SandboxStore> {
    public state: ISandboxState = {
        isActive: false,
        tabs: [],
        activeTabId: '',
        edittingSettings: false,
    };

    public getActiveTab = (): TabData => {
        return this.state.tabs.firstOrDefault(
            x => x.graph.id === this.state.activeTabId
        )!;
    };

    public hasActiveTab = (): boolean => {
        return !!this.getActiveTab();
    };

    public hasTabs = (): boolean => {
        return this.state.tabs.length > 0;
    };

    public setDefinitionsForActiveTab = (definitions: NodeCache) => {
        const activeTab = this.getActiveTab();
        activeTab.definitions = definitions;
    };

    public setActiveTab = (id: string): void => {
        this.setState({ activeTabId: id });
    };

    public toggleSettingsEdit = (value?: boolean) => {
        this.setState({
            edittingSettings: this.state.edittingSettings.toggle(value),
        });
    };

    public addTab = (graph: Graph | Macro) => {
        if (this.state.tabs.any(x => x.graph.id === graph.id)) {
            appStateContainer.toast('Graph already opened', 'warn');
            this.setActiveTab(graph.id);
            return;
        }

        this.setState({
            tabs: [
                ...this.state.tabs,
                { graph, isDirty: false, definitions: {} as any },
            ],
        });
        this.setActiveTab(graph.id);
        this.ctx.load(graph);
    };

    public removeTab = (graphId: string) => {
        this.setState({
            tabs: this.state.tabs.filter(x => x.graph.id !== graphId),
        });
    };

    public setTabs = (tabs: TabData[]) => {
        this.setState({ tabs });
    };

    public clearTabs = () => {
        this.setTabs([]);
    };
}
