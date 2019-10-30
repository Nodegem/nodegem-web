export const flatten = <T>(tree: IHierarchicalNode<T>): T[] => {
    const list = [] as T[];
    list.push(...tree.items);

    if (tree.children) {
        Object.keys(tree.children).forEach(k =>
            list.push(...flatten(tree.children[k]))
        );
    }

    return list;
};

export const convertToSelectFriendly = (
    tree: { [key: string]: IHierarchicalNode<NodeDefinition> },
    maxLevels: number = 1
): SelectFriendly<NodeDefinition> => {
    return convertToSelectFriendlyHelper(tree, maxLevels) as SelectFriendly<
        NodeDefinition
    >;
};

const convertToSelectFriendlyHelper = (
    tree: { [key: string]: IHierarchicalNode<NodeDefinition> },
    maxLevels: number,
    currentLevel: number = 0
): SelectFriendly<NodeDefinition> | NodeDefinition[] => {
    const returnObject = {};
    const returnList = [] as NodeDefinition[];

    for (const key of Object.keys(tree)) {
        const subTree = tree[key].children;
        if (currentLevel < maxLevels) {
            returnObject[key] = convertToSelectFriendlyHelper(
                subTree,
                maxLevels,
                currentLevel + 1
            );
        } else {
            let combinedList = [] as NodeDefinition[];
            const keys = Object.keys(subTree);

            for (const subKey of keys) {
                combinedList = [
                    ...combinedList,
                    ...subTree[subKey].items.filter(x => !x.ignoreDisplay),
                ];
            }
            returnObject[key] = [
                ...tree[key].items.filter(x => !x.ignoreDisplay),
                ...combinedList,
            ];
        }
    }
    return returnList.length > 0 ? returnList : returnObject;
};
