import unit from 'parse-unit';
import { isNum } from "../Draggable/utils";

export const nodeMatchesOrWithinParent = (base: Node, compare: Node) : boolean => {
    let currentNode = compare;
    while(currentNode.parentNode && currentNode !== base) {
        currentNode = currentNode.parentNode;
    }
    return !!currentNode.parentNode && currentNode === base;
}

export const parseUnit = (val: string | number) : [number, string] => {
    if(isNum(val)) {
        return [val as number, "px"];
    }
    return unit(val as string);
}

export const combineUnit = (val: [number, string]) : string => {
    return val.join("");
}