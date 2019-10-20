import { uuid } from 'lodash-uuid';

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
