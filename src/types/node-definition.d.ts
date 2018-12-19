interface NodeDefinition {
    fullName: string;
    namespace: string;
    title: string;
    description: string;
    isRequired: boolean;
    flowInputs: Array<FlowInputDefinition>;
    flowOutputs: Array<FlowOutputDefinition>;
    valueInputs: Array<ValueInputDefinition>;
    valueOutputs: Array<ValueOutputDefinition>;
}

interface FieldDefinition {
    key: string;
    label: string;
}

interface FlowInputDefinition extends FieldDefinition {

}

interface FlowOutputDefinition extends FieldDefinition {

}

interface ValueInputDefinition extends FieldDefinition {
    defaultValue: any;
    valueType: number;
}

interface ValueOutputDefinition extends FieldDefinition {

}