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