interface RunGraphData {
    nodes: Array<RunNodeData>;
    links: Array<RunConnectionData>;
}

interface RunConnectionData {
    sourceNode: string;
    sourceKey: string;
    destinationNode: string;
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