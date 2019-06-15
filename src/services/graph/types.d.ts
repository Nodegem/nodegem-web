interface Graph {
    id: string;
    name: string;
    isActive?: boolean;
    description: string;
    nodes: Array<NodeData>;
    links: Array<LinkData>;
    createdOn?: Date;
    lastUpdated?: Date;
    userId: string;
    constants: Array<ConstantData>;
}

interface ConstantData {
    key: string;
    label: string;
    type: number;
    value: any;
    isSecret: boolean;
}

interface LinkData {
    sourceNode: string;
    sourceKey: string;
    destinationNode: string;
    destinationKey: string;
}

interface NodeData {
    id: string;
    fullName: string;
    position: { x: number; y: number };
    fieldData?: Array<FieldData>;
    macroId?: string;
}

interface FieldData {
    key: string;
    value: any;
}

interface CreateGraph {
    name: string;
    description: string;
    userId: string;
    constants: ConstantData[];
}
