export function isMacro(graph: any): graph is Macro {
    return (graph as Macro).flowInputs !== undefined;
}

export function isGraph(graph: any): graph is Graph {
    return (graph as Macro).flowInputs === undefined;
}

export function isTouchEvent(
    event: TouchEvent | MouseEvent
): event is TouchEvent {
    return (
        (window as any).TouchEvent &&
        (event as TouchEvent).touches !== undefined
    );
}

export function isMouseEvent(
    event: TouchEvent | MouseEvent
): event is MouseEvent {
    return !isTouchEvent(event);
}
