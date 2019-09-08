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

export const getGraphType = (graph: Graph | Macro): GraphType => {
    return isMacro(graph) ? 'macro' : 'graph';
};

export const definitionToNode = (
    definition: NodeDefinition,
    position: Vector2 = { x: 0, y: 0 },
    id: string = uuid()
): INodeUIData => {
    return {
        id,
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
