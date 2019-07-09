import { SimpleObservable } from '@utils';
import { BaseHub } from 'src/hubs/base-hub';

export interface IBridgeInfo {
    deviceName: string;
    connectionId: string;
    userId: string;
}

const graphHubPath = process.env.REACT_APP_GRAPH_HUB as string;
class GraphHub extends BaseHub {
    private bridgeInfo: SimpleObservable<IBridgeInfo>;
    private lostBridge: SimpleObservable<void>;

    constructor() {
        super(graphHubPath);

        this.bridgeInfo = new SimpleObservable<IBridgeInfo>();
        this.lostBridge = new SimpleObservable<void>();

        this.on('BridgeInfo', this.bridgeInfo.execute);
        this.on('LostBridge', this.lostBridge.execute);
    }

    public isBridgeConnected = async () => {
        await this.invoke('IsBridgeEstablished');
    };

    public onBridgeInfo = (listener: (data: IBridgeInfo) => void) => {
        this.bridgeInfo.subscribe(listener);
    };

    public onBridgeLost = (listener: () => void) => {
        this.lostBridge.subscribe(listener);
    };

    public runGraph = async (data: Graph) => {
        await this.invoke('RunGraphAsync', data);
    };

    public runMacro = async (data: Macro, flowInputFieldKey: string) => {
        await this.invoke('RunMacroAsync', data, flowInputFieldKey);
    };

    public dispose() {
        super.dispose();
        this.bridgeInfo.clear();
    }
}

export default GraphHub;
