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
    namespace: string;
    position: { x: number, y: number };
    fieldData: Array<FieldData>;
}

interface LinkData {
    sourceNode: string;
    sourceKey: string;
    destinationNode: string;
    destinationKey: string;
}