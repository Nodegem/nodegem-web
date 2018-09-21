interface SaveGraphData {
    name: string;
    nodes: Array<SaveNodeData>;
    links: Array<SaveLinkData>;
}

interface SaveNodeData {
    id: string;
    type: string;
    position: { x: number, y: number };
    fieldData: Array<FieldData>;
}

interface SaveFieldData {
    key: string;
    value: any;
}

interface SaveLinkData {
    sourceId: string;
    sourceKey: string;
    destinationId: string;
    destinationKey: string;
}