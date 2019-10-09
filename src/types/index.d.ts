declare module 'lodash-uuid' {
    export function uuid(): string;
}

type GraphType = 'graph' | 'macro';
type IOType = 'flowInput' | 'flowOutput' | 'valueInput' | 'valueOutput';

interface IHierarchicalNode<TItem> {
    children: { [key: string]: IHierarchicalNode<TItem> };
    items: Array<TItem>;
}

interface IBridgeInfo {
    deviceIdentifier: string;
    deviceName: string;
    operatingSystem: string;
    processorCount: number;
    connectionId: string;
    userId: string;
}

interface IExecutionError {
    graphName: string;
    graphId: string;
    message: string;
    bridge: IBridgeInfo;
}

interface IDisposableStore {
    dispose: () => void;
}
