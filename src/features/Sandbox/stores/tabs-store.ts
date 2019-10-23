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
            const { tabs } = this.state;
            tabs.addOrUpdate(
                { ...tab, definitions },
                x => x.graph.id === graphId
            );
            this.setState({
                tabs: [...tabs],
            });
        }
    };

    public setActiveTab = async (id: string) => {
        await this.setState({ activeTabId: id });

        if (id) {
            this.ctx.load(this.activeTab.graph);
        }
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
    };

    public openIntroPrompt = () => {
        this.ctx.introStore.toggleStartPrompt(true);
    };

    public removeTab = (graphId: string) => {
        this.setState({
            tabs: this.state.tabs.filter(x => x.graph.id !== graphId),
        });

        if (this.hasTabs) {
            if (this.state.activeTabId === graphId) {
                this.setActiveTab(this.state.tabs.first().graph.id);
            }
        } else {
            this.resetSandbox();
        }
    };

    private resetSandbox = () => {
        this.setActiveTab('');
        this.ctx.canvasStore.clearView();
        this.ctx.nodeSelectStore.toggleOpen(false);
        this.ctx.nodeSelectStore.setNodeOptions({} as any);
        this.openIntroPrompt();
    };

    public setTabs = (tabs: TabData[]) => {
        this.setState({ tabs });
    };

    public clearTabs = () => {
        this.setTabs([]);
    };
}
