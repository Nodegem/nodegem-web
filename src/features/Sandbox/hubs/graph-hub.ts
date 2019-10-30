import { BaseHub } from 'hubs/base-hub';
import { SimpleObservable } from 'utils';

class GraphHub extends BaseHub {
    public bridgeEstablished: SimpleObservable<IBridgeInfo>;
    public bridgeInfo: SimpleObservable<IBridgeInfo[]>;
    public lostBridge: SimpleObservable<string>;
    public onGraphCompleted: SimpleObservable<IExecutionError>;

    constructor() {
        super('graphHub');

        this.bridgeInfo = new SimpleObservable();
        this.lostBridge = new SimpleObservable();
        this.onGraphCompleted = new SimpleObservable();
        this.bridgeEstablished = new SimpleObservable();

        this.on('BridgeEstablishedAsync', this.bridgeEstablished.execute);
        this.on('RequestedBridgesAsync', this.bridgeInfo.execute);
        this.on('LostBridgeAsync', this.lostBridge.execute);
        this.on('GraphCompletedAsync', this.onGraphCompleted.execute);
    }

    public requestBridges = async () => {
        await this.invoke('RequestBridgesAsync');
    };

    public runGraph = async (data: Graph, connectionId: string) => {
        await this.invoke('RunGraphAsync', data, connectionId);
    };

    public clientConnect = async () => {
        await this.invoke('ClientConnectAsync');
    };

    public clientDisconnect = async () => {
        await this.invoke('ClientDisconnectAsync');
    };

    public runMacro = async (
        data: Macro,
        connectionId: string,
        flowInputFieldKey: string
    ) => {
        await this.invoke(
            'RunMacroAsync',
            data,
            connectionId,
            flowInputFieldKey
        );
    };

    public dispose() {
        this.lostBridge.clear();
        this.bridgeInfo.clear();
        this.onGraphCompleted.clear();
        this.bridgeEstablished.clear();
        super.dispose();
    }
}

export default GraphHub;
