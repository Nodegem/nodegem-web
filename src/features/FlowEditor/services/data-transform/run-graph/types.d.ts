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
    type: string;
    fields: Array<RunFieldData>;
}

interface RunFieldData {
    key: string;
    value: any;
}