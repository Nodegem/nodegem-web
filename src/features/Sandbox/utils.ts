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

export const convertToSelectFriendly = <T>(
    tree: { [key: string]: IHierarchicalNode<T> },
    maxLevels: number = 1
): SelectFriendly<T> => {
    return convertToSelectFriendlyHelper<T>(tree, maxLevels) as SelectFriendly<
        T
    >;
};

const convertToSelectFriendlyHelper = <T>(
    tree: { [key: string]: IHierarchicalNode<T> },
    maxLevels: number,
    currentLevel: number = 0
): SelectFriendly<T> | T[] => {
    const returnObject = {};
    const returnList = [] as T[];

    for (const key of Object.keys(tree)) {
        const subTree = tree[key].children;
        if (currentLevel < maxLevels) {
            returnObject[key] = convertToSelectFriendlyHelper<T>(
                subTree,
                maxLevels,
                currentLevel + 1
            );
        } else {
            let combinedList = [] as T[];
            const keys = Object.keys(subTree);

            for (const subKey of keys) {
                combinedList = [...combinedList, ...subTree[subKey].items];
            }
            returnObject[key] = [...tree[key].items, ...combinedList];
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
    return {
        id,
        description: definition.description,
        portData: {
            flowInputs: definition.flowInputs.map<IPortUIData>(x => ({
                id: x.key,
                connected: false,
                io: 'input',
                name: x.label,
                type: 'flow',
            })),
            flowOutputs: definition.flowOutputs.map<IPortUIData>(x => ({
                id: x.key,
                connected: false,
                io: 'output',
                name: x.label,
                type: 'flow',
            })),
            valueInputs: definition.valueInputs.map<IPortUIData>(x => ({
                id: x.key,
                connected: false,
                io: 'input',
                name: x.label,
                type: 'value',
            })),
            valueOutputs: definition.valueOutputs.map<IPortUIData>(x => ({
                id: x.key,
                connected: false,
                io: 'output',
                name: x.label,
                type: 'value',
            })),
        },
        position,
        title: definition.title,
    };
};
