interface RunGraphData {
    id: string;
    nodes: RunNodeData[];
    links: RunLinkData[];
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

interface RunMacroData {
    id: string;
    nodes: RunNodeData[];
    links: MacroRunLinkData[];
    flowInputs: FlowInputFieldDto[];
    flowOutputs: FlowOutputFieldDto[];
    valueInputs: ValueInputFieldDto[];
    valueOutputs: ValueOutputFieldDto[];
}

interface MacroRunLinkData {
    sourceNode: string | undefined;
    sourceKey: string;
    destinationNode: string | undefined;
    destinationKey: string;
}
