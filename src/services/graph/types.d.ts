interface Graph {
    id: string;
    name: string;
    isActive?: boolean;
    description: string;
    type: ExecutionType;
    recurringOptions: RecurringOptions;
    nodes: Array<NodeData>;
    links: Array<LinkData>;
    createdOn?: Date | moment;
    lastUpdated?: Date | moment;
    userId: string;
    constants: Array<ConstantData>;
    metadata: { [key: string]: any };
}

interface NodeGrouping {
    id: string;
    position: Vector2;
    size: Vector2;
    title: string;
}

type ExecutionType = 'manual' | 'recurring' | 'listener';

type FrequencyOptions =
    | 'yearly'
    | 'monthly'
    | 'daily'
    | 'hourly'
    | 'minutely'
    | 'secondly';

interface RecurringOptions {
    frequency: FrequencyOptions;
    every: number;
    start?: Date;
    until?: Date;
    iterations?: number;
}

interface ConstantData {
    key: string;
    label: string;
    type: ValueType;
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
    definitionId: string;
    position: { x: number; y: number };
    fieldData?: Array<FieldData>;
    permanent?: boolean;
    macroId?: string;
    macroFieldId?: string;
    constantId?: string;
}

interface FieldData {
    key: string;
    value: any | any[];
    valueType: ValueType;
}

interface CreateGraph {
    name: string;
    description?: string;
    userId: string;
    type: ExecutionType;
    recurringOptions?: RecurringOptions;
    constants: ConstantData[];
}
