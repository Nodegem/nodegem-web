interface Graph {
    id: string;
    isDebugModeEnabled: boolean;
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
    fullName: string;
    position: { x: number; y: number };
    fieldData?: Array<FieldData>;
    permanent?: boolean;
    macroId?: string;
    macroFieldId?: string;
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
