import { isMacro } from './typeguards';

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
    let node = child.parentNode;
    while (node != null) {
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

export function getCookie(name): string | undefined {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=') || [];
    if (parts.length === 2) {
        return parts
            .pop()!
            .split(';')
            .shift();
    }

    return undefined;
}

export function getGraphType(graph: Graph | Macro): GraphType {
    return isMacro(graph) ? 'macro' : 'graph';
}

export async function exponentialBackoff<T>(
    toTry: () => Promise<T>,
    onFail: () => void = () => null,
    max: number = 10,
    delay: number = 250,
    callback: (value: T) => void = () => null
) {
    const result = await toTry();

    if (result) {
        callback(result);
    } else {
        if (max > 0) {
            setTimeout(() => {
                exponentialBackoff(toTry, onFail, --max, delay * 2, callback);
            }, delay);
        } else {
            onFail();
        }
    }
}

export const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}