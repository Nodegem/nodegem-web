import { Store } from 'overstated';
import { appStore } from 'stores';
import { SandboxStore } from '../stores';
import { getGraphType } from 'utils';

interface ITabsState {
    tabs: TabData[];
    activeTabId: string;
    hasUnread: boolean;
}

export class TabsStore extends Store<ITabsState, SandboxStore> {
    public state: ITabsState = {
        tabs: [],
        activeTabId: '',
        hasUnread: false,
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

    public get activeTabGraphType(): GraphType {
        return getGraphType(this.activeTab.graph);
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

    public refreshActiveTab = () => {
        this.setActiveTab(this.activeTab.graph.id, true);
    };

    public setActiveTab = async (id: string, forceReload: boolean = false) => {
        if (forceReload || this.state.activeTabId === id) {
            return;
        }

        await this.setState({ activeTabId: id });
        await this.setState({
            hasUnread: this.hasActiveTab && this.activeTab.hasUnread,
        });

        if (id) {
            this.ctx.logsStore.setLogs(this.activeTab.logs);
            this.ctx.load(this.activeTab.graph);
        } else {
            this.ctx.sandboxHeaderStore.onTabUnloaded();
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
                {
                    initial: { ...graph },
                    graph,
                    isDirty: false,
                    definitions: {} as any,
                    logs: [],
                    hasUnread: false,
                    modifications: [],
                },
            ],
        });

        this.setActiveTab(graph.id);
    };

    public getTabFromGraphId = (graphId: string) => {
        return this.state.tabs.firstOrDefault(x => x.graph.id === graphId);
    };

    public updateTabData = (graph: Graph | Macro) => {
        const { tabs } = this.state;
        const tabData = tabs.first(x => x.graph.id === graph.id);
        tabs.addOrUpdate(
            {
                ...tabData,
                graph,
                initial: { ...graph },
            },
            x => x.graph.id === graph.id
        );
        this.setState({ tabs: [...tabs] });

        if (graph.id === this.state.activeTabId) {
            this.setActiveTab(graph.id, true);
        }
    };

    public addLogsToCurrentTab = (logs: LogData | LogData[]) => {
        if (!this.hasActiveTab) {
            return;
        }

        this.addLogsToTab(this.activeTab.graph.id, logs);
    };

    public addLogsToTab = (graphId: string, logs: LogData | LogData[]) => {
        if (!Array.isArray(logs)) {
            logs = [logs];
        }

        const { tabs } = this.state;
        const tab = tabs.firstOrDefault(t => t.graph.id === graphId);

        if (!tab) {
            console.error(
                `Couldn't find the graph to assign logs too. Graph ID: ${graphId}`
            );
            return;
        }

        const activeGraphId = this.state.activeTabId;
        const hasUnread =
            activeGraphId !== graphId ||
            (activeGraphId === graphId && !this.ctx.logsStore.state.isOpen);

        const newLogs = [...tab.logs, ...logs];
        this.ctx.logsStore.setLogs(newLogs);
        tabs.addOrUpdate(
            { ...tab, logs: newLogs, hasUnread },
            t => t.graph.id === graphId
        );

        this.setState({
            tabs: [...tabs],
            hasUnread:
                activeGraphId === graphId && !this.ctx.logsStore.state.isOpen,
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

    public markAsRead = () => {
        if (this.hasActiveTab) {
            const { tabs } = this.state;
            tabs.addOrUpdate(
                { ...this.activeTab, hasUnread: false },
                x => x.graph.id === this.activeTab.graph.id
            );
            this.setState({ tabs: [...tabs], hasUnread: false });
        }
    };

    public clearTabs = () => {
        this.setTabs([]);
        this.setState({ activeTabId: '', hasUnread: false });
        this.ctx.canvasStore.clearView();
    };
}
