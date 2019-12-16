interface NodeDefinition {
    id: string;
    fullName: string;
    title: string;
    description: string;
    macroId?: string;
    macroFieldId?: string;
    constantId?: string;
    ignoreDisplay?: boolean;
    flowInputs: Array<FlowInputDefinition>;
    flowOutputs: Array<FlowOutputDefinition>;
    valueInputs: Array<ValueInputDefinition>;
    valueOutputs: Array<ValueOutputDefinition>;
}

interface FieldDefinition {
    key: string;
    label: string;
    indefinite: boolean;
}

interface IValueOption {
    label: string;
    value: any;
}

interface FlowInputDefinition extends FieldDefinition {}

interface FlowOutputDefinition extends FieldDefinition {}

interface ValueInputDefinition extends FieldDefinition {
    defaultValue: any;
    valueType: ValueType;
    isEditable: boolean;
    allowConnection: boolean;
    valueOptions?: IValueOption[];
}

interface ValueOutputDefinition extends FieldDefinition {
    valueType: ValueType;
}
