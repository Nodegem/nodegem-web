import { XYCoords } from './types.d';

export const nodeMatchesOrWithinParent = (base: Node, compare: Node) : boolean => {
    let currentNode = compare;
    while(currentNode.parentNode && currentNode !== base) {
        currentNode = currentNode.parentNode;
    }
    return !!currentNode.parentNode && currentNode === base;
}

const offsetXYFromParent = (evt: { clientX: number, clientY: number }, offsetParent: Element): XYCoords => {
    const isBody = offsetParent === offsetParent.ownerDocument.body;
    const offsetParentRect = isBody ? { left: 0, top: 0 } : offsetParent.getBoundingClientRect();

    const x = evt.clientX + offsetParent.scrollLeft - offsetParentRect.left;
    const y = evt.clientY + offsetParent.scrollTop - offsetParentRect.top;

    return [x, y];
}

export const getPosition = (e: MouseEvent, node: HTMLElement) : XYCoords => {
    const offsetParent = node.offsetParent || node.ownerDocument.body;
    return offsetXYFromParent(e, offsetParent);
}

export class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
}