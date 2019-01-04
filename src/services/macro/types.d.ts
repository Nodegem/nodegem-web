interface Macro extends Graph {
    flowInputs: Array<FlowInputFieldDto>;
    flowOutputs: Array<FlowOutputFieldDto>;
    valueInputs: Array<ValueInputFieldDto>;
    valueOutputs: Array<ValueOutputFieldDto>;
}

interface CreateMacro {
    name: string;
    description: string;
    userId: string;
}
