interface Macro extends Graph {
    flowInputs: Array<any>;
    flowOutputs: Array<any>;
    valueInputs: Array<any>;
    valueOutputs: Array<any>;
}

interface CreateMacro {
    name: string;
    description: string;
    userId: string;
}
