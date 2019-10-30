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
    indefinite: boolean;
}

interface FlowInputDefinition extends FieldDefinition {}

interface FlowOutputDefinition extends FieldDefinition {}

interface ValueInputDefinition extends FieldDefinition {
    defaultValue: any;
    valueType: ValueType;
}

interface ValueOutputDefinition extends FieldDefinition {
    valueType: ValueType;
}
