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

export async function exponentialBackoff<T>(
    toTry: () => Promise<T>,
    onFail: () => void = () => {},
    max: number = 10,
    delay: number = 250,
    callback: (value: T) => void = () => {}
) {
    var result = await toTry();

    if (result) {
        callback(result);
    } else {
        if (max > 0) {
            setTimeout(function() {
                exponentialBackoff(toTry, onFail, --max, delay * 2, callback);
            }, delay);
        } else {
            onFail();
        }
    }
}