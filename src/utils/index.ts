export const isInput = (target: Element) : boolean => {
    return !!target && target.nodeName === "TEXTAREA" || target.nodeName === "INPUT";
}

export const isMac : boolean = navigator.platform.toUpperCase().indexOf('MAC')>=0;