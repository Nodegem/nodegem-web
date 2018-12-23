interface RunGraphData {
    id: string;
    nodes: Array<RunNodeData>;
    links: Array<RunLinkData>;
}

interface RunLinkData {
    sourceNode: string;
    sourceKey: string;
    destinationNode: string;
    destinationKey: string;
}

interface RunNodeData {
    id: string;
    fullName: string;
    fieldData?: Array<RunFieldData>;
}

interface RunFieldData {
    key: string;
    value: any;
}
