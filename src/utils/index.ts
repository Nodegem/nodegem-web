export const isInput = (target: Element): boolean => {
    return (
        (!!target && target.nodeName === 'TEXTAREA') ||
        target.nodeName === 'INPUT' ||
        target.nodeName === 'BUTTON'
    );
};

export const getBaseApiUrl = (): string => {
    return process.env.REACT_APP_API_BASE_URL!;
};

export function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

export function getCookie(name): string | undefined {
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + name + '=') || [];
    if (parts.length == 2) {
        return parts
            .pop()!
            .split(';')
            .shift();
    }

    return undefined;
}
