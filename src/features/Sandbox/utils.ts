import { uuid } from 'lodash-uuid';

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
