interface GraphData {
    id: string;
    name: string;
    nodes: Array<NodeData>;
    links: Array<LinkData>;
}

interface NodeData {
    id: string;
    type: string;
    position: { x: number, y: number };
}

interface LinkData {
    sourceId: string;
    sourceKey: string;
    destinationId: string;
    destinationKey: string;
}