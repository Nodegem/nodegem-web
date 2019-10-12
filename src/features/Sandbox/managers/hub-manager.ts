import { computed, observable, runInAction } from 'mobx';
import GraphHub from '../hubs/graph-hub';
import TerminalHub from '../hubs/terminal-hub';

interface IHubState {
    connecting: boolean;
    connected: boolean;
}

export type HubType = 'graph' | 'terminal';

export class HubManager implements IDisposable {
    @computed
    public get isGraphConnected(): boolean {
        return this.hubStates.graph.connected;
    }

    @computed
    public get isGraphConnecting(): boolean {
        return this.hubStates.graph.connecting;
    }

    @computed
    public get isTerminalConnected(): boolean {
        return this.hubStates.terminal.connected;
    }

    @computed
    public get isTerminalConnecting(): boolean {
        return this.hubStates.terminal.connecting;
    }

    public graphHub: GraphHub;
    public terminalHub: TerminalHub;

    @observable
    private hubStates: { [key in HubType]: IHubState } = {
        graph: { connected: false, connecting: false },
        terminal: { connected: false, connecting: false },
    };

    constructor(
        private onGraphConnected: (isReconnect: boolean) => void,
        private onGraphReconnecting: () => void,
        private onGraphCompleted: (error: IExecutionError) => void,
        private onReceivedBridges: (bridges: IBridgeInfo[]) => void,
        private onBridgeEstablished: (bridge: IBridgeInfo) => void,
        private onLostBridge: (connectionId: string) => void,
        private onDisconnected: (type: HubType) => void,
        private onLogReceived: (data: LogData) => void
    ) {
        this.graphHub = new GraphHub();
        this.terminalHub = new TerminalHub();
    }

    public initialize() {
        this.resetGraphHub();
        this.resetTerminalHub();
    }

    public resetTerminalHub() {
        if (this.isTerminalConnected) {
            return;
        }

        this.terminalHub.dispose();
        this.terminalHub.onConnecting.subscribe(() =>
            this.setConnectingState('terminal')
        );

        this.terminalHub.onReconnecting.subscribe(() =>
            this.setConnectingState('terminal')
        );

        this.terminalHub.onReconnected.subscribe(() =>
            this.setConnectedState('terminal')
        );

        this.terminalHub.onConnected.subscribe(() =>
            this.setConnectedState('terminal')
        );

        this.terminalHub.log.subscribe(this.onLogReceived);

        this.terminalHub.onDisconnected.subscribe(() => {
            this.onDisconnected('terminal');
            this.setDisconnectedState('terminal');
        });

        this.terminalHub.start();
    }

    public resetGraphHub() {
        if (this.isGraphConnected) {
            return;
        }

        this.graphHub.dispose();
        this.graphHub.onConnecting.subscribe(() =>
            this.setConnectingState('graph')
        );

        this.graphHub.onGraphCompleted.subscribe(value => {
            this.onGraphCompleted(value);
        });

        this.graphHub.onReconnecting.subscribe(() => {
            this.setConnectingState('graph');
            this.onGraphReconnecting();
        });

        const graphConnectedEvent = (isReconnect = false) => {
            this.setConnectedState('graph');
            this.graphHub.clientConnect();
            this.onGraphConnected(isReconnect);
        };

        this.graphHub.onConnected.subscribe(() => graphConnectedEvent());
        this.graphHub.onReconnected.subscribe(() => graphConnectedEvent(true));
        this.graphHub.bridgeInfo.subscribe(this.onReceivedBridges);
        this.graphHub.lostBridge.subscribe(this.onLostBridge);
        this.graphHub.bridgeEstablished.subscribe(this.onBridgeEstablished);
        this.graphHub.onDisconnected.subscribe(() => {
            this.setDisconnectedState('graph');
            this.onDisconnected('graph');
        });
        this.graphHub.start();
    }

    private setConnectedState = (key: HubType) => {
        this.hubStates[key] = {
            connected: true,
            connecting: false,
        };
    };

    private setConnectingState = (key: HubType) => {
        this.hubStates[key] = {
            connected: false,
            connecting: true,
        };
    };

    private setDisconnectedState = (key: HubType) => {
        this.hubStates[key] = {
            connected: false,
            connecting: false,
        };
    };

    public dispose(): void {
        this.graphHub.clientDisconnect();
        this.graphHub.dispose();
        this.terminalHub.dispose();
    }
}
