import moment from 'moment';
import { Store } from 'overstated';
import { appStore, graphModalStore, macroModalStore } from 'stores';
import { isMacro } from 'utils';
import { SandboxStore } from '.';
import GraphHub from '../hubs/graph-hub';

interface ISandboxHeaderState {
    isSavingGraph: boolean;
    isRunning: boolean;
    bridge?: IBridgeInfo;
    bridges: IBridgeInfo[];
    loadingBridges: boolean;
    modifyingGraphSettings: boolean;
    canSave: boolean;
    canEdit: boolean;
    connected: boolean;
    connecting: boolean;
}

export class SandboxHeaderStore extends Store<
    ISandboxHeaderState,
    SandboxStore
> {
    public get bridges(): IBridgeInfo[] {
        return this.state.bridges;
    }

    public get selectedBridge(): IBridgeInfo {
        return this.state.bridge!;
    }

    public get hasSelectedBridge(): boolean {
        return !!this.state.bridge;
    }

    public get hasBridges(): boolean {
        return this.state.bridges.any();
    }

    public state: ISandboxHeaderState = {
        isSavingGraph: false,
        isRunning: false,
        bridges: [],
        loadingBridges: false,
        modifyingGraphSettings: false,
        canSave: false,
        canEdit: false,
        connected: false,
        connecting: false,
    };

    public graphHub: GraphHub = new GraphHub();

    private timeout: NodeJS.Timeout;

    constructor() {
        super();

        this.graphHub.onConnecting.subscribe(() => {
            this.setState({ connected: false, connecting: true });
        });

        this.graphHub.onGraphCompleted.subscribe(value => {
            if (value) {
                appStore.toast(
                    'An exception occurred while executing graph. Open logs for more details.',
                    'error'
                );
                console.error(value);
                this.ctx.tabsStore.addLogsToTab(value.graphId, {
                    graphId: value.graphId,
                    message: JSON.stringify(value),
                    type: 'error',
                    timestamp: moment.now(),
                });
            } else {
                appStore.toast('Graph ran successfully!');
            }

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.setState({ isRunning: false });
        });

        this.graphHub.onConnected.subscribe(() => {
            this.setState({ connecting: false, connected: true });
            this.graphHub.clientConnect();
            this.refreshBridges();
        });

        this.graphHub.onReconnecting.subscribe(() => {
            this.setState({ connected: false, connecting: true });
            appStore.toast('Lost connection. Attempting reconnect...', 'warn');
        });

        this.graphHub.onReconnected.subscribe(() => {
            this.setState({ connected: true });
            this.graphHub.clientConnect();
            appStore.toast('Successfully reconnected!');
        });

        this.graphHub.bridgeInfo.subscribe(bridges => {
            this.setState({ loadingBridges: false });

            if (bridges.any()) {
                this.setState({ bridges });

                if (!this.hasSelectedBridge) {
                    this.setState({ bridge: bridges.first() });
                }
            } else {
                appStore.toast('No bridges found', 'warn');
            }
        });

        this.graphHub.lostBridge.subscribe(x => {
            const { bridges, selectedBridge } = this;
            if (bridges.any(b => b.connectionId === x)) {
                const bridgeLost = bridges.first(b => b.connectionId === x);
                appStore.toast(
                    `Lost connection to bridge (${bridgeLost.deviceName})`,
                    'warn'
                );

                this.setState({
                    bridges: bridges.filter(b => b.connectionId !== x),
                });

                if (selectedBridge && selectedBridge.connectionId === x) {
                    this.setState({ bridge: undefined });
                }
            }
        });

        this.graphHub.bridgeEstablished.subscribe(x => {
            const { bridges } = this;
            if (bridges.every(b => b.deviceIdentifier !== x.deviceIdentifier)) {
                appStore.toast('A new bridge was found!');
            }

            bridges.addOrUpdate(
                x,
                b => b.deviceIdentifier === x.deviceIdentifier
            );
            this.setState({ bridges: [...bridges] });

            if (
                !this.hasSelectedBridge ||
                this.selectedBridge!.deviceIdentifier === x.deviceIdentifier
            ) {
                this.setState({ bridge: x });
            }
        });

        this.graphHub.onDisconnected.subscribe(() => {
            appStore.toast('Lost connection to graph service', 'error');
            this.setState({ connected: false });
        });

        this.graphHub.start();
    }

    public runGraph = () => {
        if (!this.ctx.tabsStore.hasActiveTab) {
            appStore.toast('Must select a graph', 'error');
            return;
        }

        const { selectedBridge, hasSelectedBridge } = this;
        const { connected } = this.state;
        if (connected && hasSelectedBridge) {
            const connectionId = selectedBridge.connectionId;
            const graph = this.ctx.getConvertedGraphData();

            this.setState({ isRunning: true });

            if (isMacro(graph)) {
                // this.graphHub.runMacro(graph);
            } else {
                this.graphHub.runGraph(graph, connectionId);
            }

            this.timeout = setTimeout(() => {
                this.setState({ isRunning: false });
                appStore.toast('Timeout exception', 'error');
            }, 30000);
        }
    };

    public onBridgeSelect = (bridge: IBridgeInfo) => {
        this.setState({ bridge });
    };

    public refreshBridges = () => {
        this.setState({ loadingBridges: true });
        this.graphHub.requestBridges();
    };

    public onEditGraph = () => {
        const { graph } = this.ctx.tabsStore.activeTab;
        if (isMacro(graph)) {
            macroModalStore.openModal(graph, true);
        } else {
            graphModalStore.openModal(graph, true);
        }
        this.setState({ modifyingGraphSettings: true });
    };

    public onTabLoaded = () => {
        this.setState({
            canSave: true,
            canEdit: true,
        });
    };

    public onTabUnloaded = () => {
        this.setState({
            canSave: false,
            canEdit: false,
        });
    };
}
