interface NodeDefinition {
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
}

interface FlowInputDefinition extends FieldDefinition {}

interface FlowOutputDefinition extends FieldDefinition {}

interface ValueInputDefinition extends FieldDefinition {
    defaultValue: any;
    valueType: ValueType;
    indefinite: boolean;
}

interface ValueOutputDefinition extends FieldDefinition {
    valueType: ValueType;
}
