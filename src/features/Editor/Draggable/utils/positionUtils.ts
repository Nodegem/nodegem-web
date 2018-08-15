import DraggableCore from "../DraggableCore";
import { Vector2 } from "./types";
import { findDomNode } from ".";

export const offsetXYFromParent = (evt: { clientX: number, clientY: number }, offsetParent: Element): Vector2 => {
    const isBody = offsetParent === offsetParent.ownerDocument.body;
    const offsetParentRect = isBody ? { left: 0, top: 0 } : offsetParent.getBoundingClientRect();

    const x = evt.clientX + offsetParent.scrollLeft - offsetParentRect.left;
    const y = evt.clientY + offsetParent.scrollTop - offsetParentRect.top;

    return { x, y };
}

export const getPosition = (e: React.MouseEvent, core: DraggableCore): Vector2 => {
    const node = findDomNode(core);
    const offsetParent = node.offsetParent || node.ownerDocument.body;
    return offsetXYFromParent(e, offsetParent);
}

export function createSVGTransform({ x, y }: { x?: number, y?: number }): string {
    return 'translate(' + x + ',' + y + ')';
}

export function snapToGrid(grid: [number, number], pendingX: number, pendingY: number): [number, number] {
    const x = Math.round(pendingX / grid[0]) * grid[0];
    const y = Math.round(pendingY / grid[1]) * grid[1];
    return [x, y];
}