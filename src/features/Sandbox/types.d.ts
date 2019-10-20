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

type PortDataSlim = {
    id: string;
    name: string;
    nodeId: string;
    io: PortIOType;
    type: PortType;
    connected?: boolean;
    connecting?: boolean;
};
