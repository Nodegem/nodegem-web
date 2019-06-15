declare module 'lodash-uuid' {
    export function uuid(): string;
}

type GraphType = 'graph' | 'macro';
type IOType = 'flowInput' | 'flowOutput' | 'valueInput' | 'valueOutput';

interface IHierarchicalNode<TItem> {
    children: { [key: string]: IHierarchicalNode<TItem> };
    items: Array<TItem>;
}
