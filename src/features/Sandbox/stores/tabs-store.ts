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

    public get activeTabLogs(): LogData[] {
        return this.hasActiveTab ? this.activeTab.logs : [];
    }

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

    public setActiveTab = async (id: string, forceReload: boolean = false) => {
        if (!forceReload && this.state.activeTabId === id) {
            return;
        }

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
                { graph, isDirty: false, definitions: {} as any, logs: [] },
            ],
        });

        this.setActiveTab(graph.id);
    };

    public updateTabData = (graph: Graph | Macro) => {
        const { tabs } = this.state;
        const tabData = tabs.first(x => x.graph.id === graph.id);
        tabs.addOrUpdate({ ...tabData, graph }, x => x.graph.id === graph.id);
        this.setState({ tabs: [...tabs] });

        if (graph.id === this.state.activeTabId) {
            this.setActiveTab(graph.id, true);
        }
    };

    public addLogsToCurrentTab = (logs: LogData[]) => {
        if (!this.hasActiveTab) {
            return;
        }

        const { tabs } = this.state;
        const { activeTab } = this;
        const currentTabLogs = activeTab.logs;

        tabs.addOrUpdate(
            { ...activeTab, logs: [...currentTabLogs, ...logs] },
            t => t.graph.id === activeTab.graph.id
        );

        this.setState({
            tabs: [...tabs],
        });
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
