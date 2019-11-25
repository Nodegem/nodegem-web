interface NodeDefinition {
    id: string;
    fullName: string;
    title: string;
    description: string;
    macroId?: string;
    macroFieldId?: string;
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

interface FlowInputDefinition extends FieldDefinition {}

interface FlowOutputDefinition extends FieldDefinition {}

interface ValueInputDefinition extends FieldDefinition {
    defaultValue: any;
    valueType: ValueType;
    isEditable: boolean;
    allowConnection: boolean;
    valueOptions?: any[];
}

interface ValueOutputDefinition extends FieldDefinition {
    valueType: ValueType;
}
