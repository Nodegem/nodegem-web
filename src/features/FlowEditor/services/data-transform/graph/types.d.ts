interface GraphData {
    id: string;
    name: string;
    nodes: Array<NodeData>;
    links: Array<LinkData>;
}

interface FieldData {
    key: string;
    value: any;
}

interface NodeData {
    id: string;
    type: string;
    position: { x: number, y: number };
    fieldData: Array<FieldData>;
}

interface LinkData {
    sourceId: string;
    sourceKey: string;
    destinationId: string;
    destinationKey: string;
}