interface Macro extends Graph {
    flowInputs: Array<any>;
}

interface CreateMacro {
    name: string;
    description: string;
    userId: string;
}
