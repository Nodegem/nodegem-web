export const isInput = (target: Element) : boolean => {
    return !!target && target.nodeName === "TEXTAREA" || target.nodeName === "INPUT" || target.nodeName === "BUTTON";
}