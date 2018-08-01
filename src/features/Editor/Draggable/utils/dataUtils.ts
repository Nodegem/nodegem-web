import { findDomNode } from './index';
import DraggableCore, { DragData } from "../DraggableCore";
import { isNum } from ".";

export const createCoreData = (core: DraggableCore, x: number, y: number) : DragData => {

    const node = findDomNode(core);
    const state = core.state;
    const isStart = !isNum(state.lastPosition.x);

    if(isStart) {
        return {
            node: node,
            delta: { x: 0, y: 0 },
            lastPosition: { x: x, y: y },
            position: { x: x, y: y }
        }
    }

    return {
        node: node,
        delta: {
            x: x - state.lastPosition.x,
            y: y - state.lastPosition.y
        },
        lastPosition: state.lastPosition,
        position: { x: x, y: y }
    }

}