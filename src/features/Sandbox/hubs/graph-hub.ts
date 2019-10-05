import { BaseHub } from 'hubs/base-hub';
import { SimpleObservable } from 'utils';

const graphHubPath = process.env.REACT_APP_GRAPH_HUB as string;
class GraphHub extends BaseHub {
    public bridgeInfo: SimpleObservable<IBridgeInfo[]>;
    public lostBridge: SimpleObservable<void>;
    public onGraphCompleted: SimpleObservable<IExecutionError>;

    constructor() {
        super(graphHubPath);

        this.bridgeInfo = new SimpleObservable();
        this.lostBridge = new SimpleObservable();
        this.onGraphCompleted = new SimpleObservable();

        this.on('BridgeAsync', this.bridgeInfo.execute);
        this.on('LostBridgeAsync', this.lostBridge.execute);
        this.on('GraphCompletedAsync', this.onGraphCompleted.execute);
    }

    public requestBridges = async () => {
        await this.invoke('RequestBridgesAsync');
    };

    public runGraph = async (data: Graph, connectionId: string) => {
        await this.invoke('RunGraphAsync', data, connectionId);
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
        super.dispose();
        this.lostBridge.clear();
        this.bridgeInfo.clear();
        this.onGraphCompleted.clear();
    }
}

export default GraphHub;
