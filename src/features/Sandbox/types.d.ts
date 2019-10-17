type SelectFriendly<T> = { [title: string]: T[] | SelectFriendly<T> };
type TabData = {
    graph: Graph | Macro;
    isDirty: boolean;
    definitions: NodeCache;
};

type NodeCache = {
    definitions: IHierarchicalNode<NodeDefinition>;
    definitionList: NodeDefinition[];
    definitionLookup: { [id: string]: NodeDefinition };
    selectFriendly: SelectFriendly<NodeDefinition>;
};
