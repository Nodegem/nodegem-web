interface RunGraphData {
    nodes: Array<RunNodeData>;
    connections: Array<RunConnectionData>;
}

interface RunConnectionData {
    source: string;
    sourceKey: string;
    destination: string;
    destinationKey: string;
}

interface RunNodeData {
    id: string;
    namespace: string;
    fieldData: Array<RunFieldData>;
}

interface RunFieldData {
    key: string;
    value: any;
}