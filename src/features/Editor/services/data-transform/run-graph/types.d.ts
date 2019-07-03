interface RunGraphData {
    id: string;
    nodes: RunNodeData[];
    links: RunLinkData[];
    isDebugModeEnabled: boolean;
    constants: ConstantData[];
}

interface RunLinkData {
    sourceNode: string;
    sourceKey: string;
    destinationNode: string;
    destinationKey: string;
}

interface RunNodeData {
    id: string;
    fullName: string;
    fieldData?: RunFieldData[];
    macroId?: string;
    macroFieldId?: string;
}

interface RunFieldData {
    key: string;
    value: any;
}

interface RunMacroData extends RunGraphData {
    flowInputs: FlowInputFieldDto[];
    flowOutputs: FlowOutputFieldDto[];
    valueInputs: ValueInputFieldDto[];
    valueOutputs: ValueOutputFieldDto[];
}
