import localforage from 'localforage';
import moment from 'moment';
import { Store } from 'overstated';
import { appStore } from 'stores';
import { hasItem, isMacro } from 'utils';
import { SandboxStore } from '.';
import GraphHub from '../hubs/graph-hub';

const autoSaveGraphKey = () => `${appStore.userStore.user.id}-autosaveGraph`;
const autoSaveNodeKey = () => `${appStore.userStore.user.id}-autosaveNode`;

interface ISandboxHeaderState {
    isSavingGraph: boolean;
    bridge?: IBridgeInfo;
    bridges: IBridgeInfo[];
    loadingBridges: boolean;
    canSave: boolean;
    canEdit: boolean;
    connected: boolean;
    connecting: boolean;
    autoSaveGraph: boolean;
    autoSaveNode: boolean;
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
        bridges: [],
        loadingBridges: false,
        canSave: false,
        canEdit: false,
        connected: false,
        connecting: false,
        autoSaveGraph: true,
        autoSaveNode: true,
    };

    public graphHub: GraphHub = new GraphHub();

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
            this.setState({ connected: true, connecting: false });
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

        this.graphHub.onGraphError.subscribe(error => {
            console.error(error);
            this.ctx.tabsStore.addLogsToTab(error.graphId, {
                graphId: error.graphId,
                message: JSON.stringify(error),
                type: 'error',
                timestamp: moment.now(),
            });
        });

        this.graphHub.onDisconnected.subscribe(() => {
            appStore.toast('Lost connection to graph service', 'error');
            this.setState({ connected: false });
        });

        this.graphHub.start();
    }

    public initialize = async () => {
        this.suspend();
        if (await hasItem(autoSaveGraphKey())) {
            this.setState({
                autoSaveGraph: await localforage.getItem(autoSaveGraphKey()),
            });
        }

        if (await hasItem(autoSaveNodeKey())) {
            this.setState({
                autoSaveNode: await localforage.getItem(autoSaveNodeKey()),
            });
        }
        this.unsuspend();
    };

    public runGraph = (
        flowInput?: FlowInputFieldDto,
        valueInputs?: ValueInputFieldDto[]
    ) => {
        if (!this.ctx.tabsStore.hasActiveTab) {
            appStore.toast('Must select a graph to run', 'error');
            return;
        }

        if (!this.state.bridge) {
            appStore.toast('Must select a bridge to run', 'error');
            return;
        }

        const { selectedBridge, hasSelectedBridge } = this;
        const { connected } = this.state;
        if (connected && hasSelectedBridge) {
            const connectionId = selectedBridge.connectionId;
            const graph = this.ctx.getConvertedGraphData(true);

            if (isMacro(graph) && flowInput) {
                this.graphHub.runMacro(graph, connectionId, flowInput.key);
            } else {
                this.graphHub.runGraph(graph, connectionId);
            }
        }
    };

    public onBridgeSelect = (bridge: IBridgeInfo) => {
        this.setState({ bridge });
    };

    public refreshBridges = () => {
        this.setState({ loadingBridges: true });
        this.graphHub.requestBridges();
    };

    public toggleAutosaveGraph = (toggle?: boolean) => {
        const value = this.state.autoSaveGraph.toggle(toggle);
        localforage.setItem(autoSaveGraphKey(), value);
        this.setState({
            autoSaveGraph: this.state.autoSaveGraph.toggle(toggle),
        });
    };

    public toggleAutosaveNode = (toggle?: boolean) => {
        const value = this.state.autoSaveNode.toggle(toggle);
        localforage.setItem(autoSaveNodeKey(), value);
        this.setState({ autoSaveNode: value });
    };

    public onEditGraph = () => {
        const { initial } = this.ctx.tabsStore.activeTab;
        if (isMacro(initial)) {
            this.ctx.introStore.setState({
                isMacroModalOpen: true,
                graphToEdit: initial,
            });
        } else {
            this.ctx.introStore.setState({
                isGraphModalOpen: true,
                graphToEdit: initial,
            });
        }
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

    public dispose() {
        this.setState({
            bridges: [],
            bridge: undefined,
        });
    }
}
