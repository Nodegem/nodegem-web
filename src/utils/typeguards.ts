export function isMacro(graph: Graph | Macro): graph is Macro {
    return (graph as Macro).flowInputs !== undefined;
}

export function isTouchEvent(
    event: TouchEvent | MouseEvent
): event is TouchEvent {
    return (
        (window as any).TouchEvent &&
        (event as TouchEvent).touches !== undefined
    );
}
