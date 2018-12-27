type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

declare module 'lodash-uuid' {
    export function uuid(): string;
}

type GraphType = 'graph' | 'macro';
