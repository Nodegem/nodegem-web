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
    graphHubConnectionId: string;
    userId: string;
}

interface INodeError {
    id: string;
    name: string;
    message: string;
}

interface IExecutionError {
    graphName: string;
    graphId: string;
    message: string;

    isBuildError: boolean;
    bridge: IBridgeInfo;
}

interface IDisposableStore {
    dispose: () => void;
}
