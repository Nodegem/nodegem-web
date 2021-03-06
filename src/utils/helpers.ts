import gravatar from 'gravatar';
import { isMacro } from './typeguards';

export const parseJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );

    return JSON.parse(jsonPayload);
};

export const jwtToUser = (jwt: any): User => {
    return {
        id: jwt.nameid,
        userName: jwt.unique_name,
        email: jwt.sub,
        constants: JSON.parse(jwt.constantData),
        firstName: jwt.given_name || '',
        lastName: jwt.family_name || '',
        avatarUrl: jwt.avatarUrl || getGravatarUrl(jwt.sub),
        providers: JSON.parse(jwt.providers) || [],
    };
};

export const getGravatarUrl = (email: string) => {
    return gravatar.url(
        email,
        {
            s: '128',
            r: 'pg',
            d: 'retro',
        },
        true
    );
};

export const isInput = (target: Element): boolean => {
    return (
        (!!target && target.nodeName === 'TEXTAREA') ||
        target.nodeName === 'INPUT' ||
        target.nodeName === 'BUTTON'
    );
};

export const getBaseApiUrl = (): string => {
    return process.env.REACT_APP_API_BASE_URL || '';
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

export function getGraphType(
    graph: Graph | Macro | Partial<Graph | Macro>
): GraphType {
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

export function getCenterCoordinates(element: HTMLElement): Vector2 {
    const { x, y, width, height } = element.getBoundingClientRect() as DOMRect;
    return {
        x: x + width / 2,
        y: y + height / 2,
    };
}

export const waitWhile = async (predicate: () => boolean) => {
    while (!predicate()) {
        await sleep(1);
    }
};

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const reorder = <T>(
    list: T[],
    startIndex: number,
    endIndex: number
): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export const isJSON = (str: string) => {
    try {
        const obj = JSON.parse(str);
        if (obj && typeof obj === 'object' && obj !== null) {
            return true;
        }
    } catch (err) {}
    return false;
};
