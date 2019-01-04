export function isMacro(graph: Graph | Macro): graph is Macro {
    return (<Macro>graph).flowInputs !== undefined;
}
