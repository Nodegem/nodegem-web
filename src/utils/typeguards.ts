export function isMacro(graph: Graph | Macro): graph is Macro {
    return (graph as Macro).flowInputs !== undefined;
}
