import DraggableCore from "../DraggableCore";
import Draggable from "../Draggable";
import ReactDOM from "react-dom";
import { isFunction } from "util";

export const addEvent = (node: any, eventString: string, handler: Function) => {
    if (!node) { return; }
    if (node.attachEvent) {
        node.attachEvent(`on${eventString}`, handler);
    }
    else if (node.addEventListener) {
        node.addEventListener(eventString, handler, true);
    } else {
        node[`on${eventString}`] = handler;
    }
}

export const removeEvent = (node: any, eventString: string, handler: Function) => {
    if (!node) { return; }
    if (node.detachEvent) {
        node.detachEvent(`on${eventString}`, handler);
    } else if (node.removeEventListener) {
        node.removeEventListener(eventString, handler, true);
    } else {
        node[`on${eventString}`] = null;
    }
}

export function findInArray(array: Array<any> | TouchList, callback: Function): any {
    for (let i = 0, length = array.length; i < length; i++) {
        if (callback.apply(callback, [array[i], i, array])) return array[i];
    }
}

let matchesSelectorFunc = '';
export function matchesSelector(el: Node, selector: string): boolean {
    if (!matchesSelectorFunc) {
        matchesSelectorFunc = findInArray([
            'matches',
            'webkitMatchesSelector',
            'mozMatchesSelector',
            'msMatchesSelector',
            'oMatchesSelector'
        ], function (method) {
            return isFunction(el[method]);
        });
    }

    // Might not be found entirely (not an Element?) - in that case, bail
    if (!isFunction(el[matchesSelectorFunc])) return false;

    return el[matchesSelectorFunc](selector);
}

export function matchesSelectorAndParentsTo(el: Node, selector: string, baseNode: Node): boolean {
    let node = el;
    do {
        if (matchesSelector(node, selector)) return true;
        if (node === baseNode) return false;
        node = node.parentNode!;
    } while (node);

    return false;
}

export const isNum = (num: any): boolean => {
    return typeof num === "number" && !isNaN(num);
}

export const findDomNode = (draggable: Draggable | DraggableCore): HTMLElement => {
    const node = ReactDOM.findDOMNode(draggable);
    if (!node || !(node instanceof Element)) {
        throw new Error("Draggable node not found");
    }
    return node as HTMLElement;
}

export const findParentWithTransform = (draggable: Draggable): SVGElement => {
    let node = findDomNode(draggable).parentNode as SVGElement;
    while (node && node.getAttribute && !node.getAttribute("transform")) {
        node = node.parentNode as SVGElement;
    }
    return node;
}

export const parseTransform = (a: any): any => {
    var b = {};
    for (var i in a = a.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?)+\))+/g)) {
        var c = a[i].match(/[\w\.\-]+/g);
        b[c.shift()] = c;
    }
    return b;
}