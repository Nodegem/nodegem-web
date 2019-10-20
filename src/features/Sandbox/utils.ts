import { uuid } from 'lodash-uuid';

export const isValidConnection = (
    p1: PortDataSlim,
    p2: PortDataSlim
): boolean => {
    if (p1.io === p2.io) {
        return false;
    }

    if (p1.type !== p2.type) {
        return false;
    }

    if (p1.nodeId === p2.nodeId) {
        return false;
    }

    const source = p1.io === 'output' ? p1 : p2;
    const destination = p1.io === 'output' ? p2 : p1;

    if (source.type === 'flow' && source.connected) {
        return false;
    }

    return true;
};

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

export const getAllPorts = (node: INodeUIData) => {
    const {
        flowInputs,
        flowOutputs,
        valueInputs,
        valueOutputs,
    } = node.portData;
    return [...flowInputs, ...flowOutputs, ...valueInputs, ...valueOutputs];
};

export const getPort = (node: INodeUIData, key: string) => {
    return getAllPorts(node).firstOrDefault(x => x.id === key);
};

export const definitionToNode = (
    definition: NodeDefinition,
    position: Vector2 = { x: 0, y: 0 },
    id: string = uuid()
): INodeUIData => {
    const { flowInputs, flowOutputs, valueInputs, valueOutputs } = definition;
    return {
        id,
        fullName: definition.fullName,
        description: definition.description,
        portData: {
            flowInputs: (flowInputs || []).map<IPortUIData>(x => ({
                id: x.key,
                connected: false,
                io: 'input',
                name: x.label,
                type: 'flow',
                value: null,
            })),
            flowOutputs: (flowOutputs || []).map<IPortUIData>(x => ({
                id: x.key,
                connected: false,
                io: 'output',
                name: x.label,
                type: 'flow',
                value: null,
            })),
            valueInputs: (valueInputs || []).map<IPortUIData>(x => ({
                id: x.key,
                connected: false,
                io: 'input',
                name: x.label,
                type: 'value',
                defaultValue: x.defaultValue,
                valueType: x.valueType,
                indefinite: x.indefinite,
                value: x.defaultValue,
            })),
            valueOutputs: (valueOutputs || []).map<IPortUIData>(x => ({
                id: x.key,
                connected: false,
                io: 'output',
                name: x.label,
                type: 'value',
                valueType: x.valueType,
                value: null,
            })),
        },
        position,
        title: definition.title,
        macroFieldId: definition.macroFieldId,
        macroId: definition.macroId,
        selected: false,
    };
};

const tryGetValue = (node: NodeData, key: string, defaultValue?: any) => {
    if (node.fieldData) {
        const fd = node.fieldData.firstOrDefault(x => x.key === key);
        return (fd && fd.value) || defaultValue;
    }

    return defaultValue;
};

export const nodeDataToUINodeData = (
    node: NodeData,
    definition: NodeDefinition
): INodeUIData => {
    const { flowInputs, flowOutputs, valueInputs, valueOutputs } = definition;
    return {
        id: node.id,
        fullName: node.fullName,
        position: node.position || { x: 0, y: 0 },
        description: definition.description,
        macroFieldId: definition.macroFieldId,
        macroId: definition.macroId,
        portData: {
            flowInputs: (flowInputs || []).map<IPortUIData>(fi => ({
                id: fi.key,
                name: fi.label,
                io: 'input',
                type: 'flow',
                value: tryGetValue(node, fi.key),
            })),
            flowOutputs: (flowOutputs || []).map<IPortUIData>(fo => ({
                id: fo.key,
                name: fo.label,
                io: 'output',
                type: 'flow',
                value: tryGetValue(node, fo.key),
            })),
            valueInputs: (valueInputs || []).flatMap<IPortUIData>(vi => {
                if (vi.indefinite && node.fieldData) {
                    return node.fieldData
                        .filter(x => x.key.includes('|'))
                        .map(fd => ({
                            id: fd.key,
                            name: vi.label,
                            io: 'input',
                            type: 'value',
                            valueType: vi.valueType,
                            defaultValue: vi.defaultValue,
                            indefinite: vi.indefinite,
                            value: tryGetValue(node, fd.key, vi.defaultValue),
                        }));
                }

                return [
                    {
                        id: vi.key,
                        name: vi.label,
                        io: 'input',
                        type: 'value',
                        valueType: vi.valueType,
                        defaultValue: vi.defaultValue,
                        indefinite: vi.indefinite,
                        value: tryGetValue(node, vi.key, vi.defaultValue),
                    },
                ];
            }),
            valueOutputs: (valueOutputs || []).map<IPortUIData>(vo => ({
                id: vo.key,
                name: vo.label,
                io: 'output',
                type: 'value',
                valueType: vo.valueType,
                value: tryGetValue(node, vo.key),
            })),
        },
        title: definition.title,
        permanent: node.permanent,
        selected: false,
    };
};
