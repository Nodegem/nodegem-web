interface IHierarchicalNode<TItem> {
    children: { [key: string]: IHierarchicalNode<TItem> };
    items: Array<TItem>;
}

export default class HierarchicalNode<TItem>
    implements IHierarchicalNode<TItem> {
    children: { [key: string]: HierarchicalNode<TItem> } = {};
    items: Array<TItem> = [];

    getOrAddChild(key: string) {
        let node: HierarchicalNode<TItem>;
        if (!this.children[key]) {
            node = this.children[key] = new HierarchicalNode<TItem>();
        } else {
            node = this.children[key];
        }
        return node;
    }

    addObject(nodes: Array<any>, item: TItem) {
        this._addObject(nodes, 0, item);
    }

    private _addObject(nodes: Array<any>, index: number, item: TItem) {
        if (index >= nodes.length) {
            this.items.push(item);
        } else {
            this.getOrAddChild(nodes[index])!._addObject(
                nodes,
                index + 1,
                item
            );
        }
    }
}
