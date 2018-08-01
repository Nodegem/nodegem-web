import DraggableCore from "../DraggableCore";
import Draggable from "../Draggable";
import ReactDOM from "react-dom";

export const addEvent = (node: any, eventString: string, handler: Function) => {
    if (!node) { return; }
    if(node.attachEvent) {
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

export const isNum = (num: any) : boolean => {
    return typeof num === "number" && !isNaN(num);
}

export const findDomNode = (draggable: Draggable | DraggableCore) : HTMLElement => {
    const node = ReactDOM.findDOMNode(draggable);
    if(!node || !(node instanceof HTMLElement)) {
        throw new Error("Draggable node not found");
    }
    return node;
}