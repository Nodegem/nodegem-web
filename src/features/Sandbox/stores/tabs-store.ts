import { appStore } from 'app-state-store';
import { Store } from 'overstated';
import { SandboxStore } from '.';

interface ITabsState {
    tabs: TabData[];
    activeTabId: string;
}

export class TabsStore extends Store<ITabsState, SandboxStore> {
    public state: ITabsState = {
        tabs: [],
        activeTabId: '',
    };

    public get activeTab(): TabData {
        return this.state.tabs.firstOrDefault(
            x => x.graph.id === this.state.activeTabId
        )!;
    }

    public get hasActiveTab(): boolean {
        return !!this.activeTab;
    }

    public get hasTabs(): boolean {
        return this.state.tabs.length > 0;
    }

    public setDefinitionsForGraph = (
        graphId: string,
        definitions: NodeCache
    ) => {
        const tab = this.state.tabs.firstOrDefault(x => x.graph.id === graphId);
        if (tab) {
            this.setState({
                tabs: [
                    ...this.state.tabs.filter(x => x.graph.id !== graphId),
                    {
                        ...tab,
                        definitions,
                    },
                ],
            });
        }
    };

    public setActiveTab = (id: string): void => {
        this.setState({ activeTabId: id });
    };

    public addTab = (graph: Graph | Macro) => {
        if (this.state.tabs.any(x => x.graph.id === graph.id)) {
            appStore.toast('Graph already opened', 'warn');
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

    public openIntroPrompt = () => {
        this.ctx.introStore.toggleStartPrompt(true);
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
