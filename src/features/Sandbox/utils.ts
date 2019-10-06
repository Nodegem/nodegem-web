import { uuid } from 'lodash-uuid';
import { isMacro } from 'utils';

export const isValidConnection = (
    p1: { nodeId: string; port: IPortUIData },
    p2: { nodeId: string; port: IPortUIData }
): boolean => {
    if (p1.port.io === p2.port.io) {
        return false;
    }

    if (p1.port.type !== p2.port.type) {
        return false;
    }

    if (p1.nodeId === p2.nodeId) {
        return false;
    }

    const source = p1.port.io === 'output' ? p1 : p2;
    const destination = p1.port.io === 'output' ? p2 : p1;

    if (source.port.type === 'flow' && source.port.connected) {
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

export const getGraphType = (graph: Graph | Macro): GraphType => {
    return isMacro(graph) ? 'macro' : 'graph';
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
    };
};
