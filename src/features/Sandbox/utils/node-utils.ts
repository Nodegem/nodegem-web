import { uuid } from 'lodash-uuid';

export const getAllPorts = (node: INodeUIData) => {
    const { flowInputs, flowOutputs, valueInputs, valueOutputs } = node;
    return [...flowInputs, ...flowOutputs, ...valueInputs, ...valueOutputs];
};

export const getFlowPorts = (node: INodeUIData) => {
    const { flowInputs, flowOutputs } = node;
    return [...flowInputs, ...flowOutputs];
};

export const getValuePorts = (node: INodeUIData) => {
    const { valueInputs, valueOutputs } = node;
    return [...valueInputs, ...valueOutputs];
};

export const getPort = (node: INodeUIData, key: string) => {
    return getAllPorts(node).firstOrDefault(x => x.id === key);
};

export const getFlowPort = (node: INodeUIData, key: string) => {
    return getFlowPorts(node).firstOrDefault(x => x.id === key);
};

export const getValuePort = (node: INodeUIData, key: string) => {
    return getValuePorts(node).firstOrDefault(x => x.id === key);
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
        flowInputs: (flowInputs || []).map<IPortUIData>(x => ({
            id: x.key,
            connected: false,
            io: 'input',
            name: x.label,
            type: 'flow',
            value: null,
            indefinite: x.indefinite,
            nodeId: id,
        })),
        flowOutputs: (flowOutputs || []).map<IPortUIData>(x => ({
            id: x.key,
            connected: false,
            io: 'output',
            name: x.label,
            type: 'flow',
            value: null,
            indefinite: x.indefinite,
            nodeId: id,
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
            nodeId: id,
            isEditable: x.isEditable === undefined ? true : x.isEditable,
        })),
        valueOutputs: (valueOutputs || []).map<IPortUIData>(x => ({
            id: x.key,
            connected: false,
            io: 'output',
            name: x.label,
            type: 'value',
            valueType: x.valueType,
            value: null,
            indefinite: x.indefinite,
            nodeId: id,
        })),
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
        flowInputs: (flowInputs || []).map<IPortUIData>(fi => ({
            id: fi.key,
            name: fi.label,
            io: 'input',
            type: 'flow',
            value: tryGetValue(node, fi.key),
            indefinite: fi.indefinite,
            nodeId: node.id,
            connected: false,
        })),
        flowOutputs: (flowOutputs || []).map<IPortUIData>(fo => ({
            id: fo.key,
            name: fo.label,
            io: 'output',
            type: 'flow',
            value: tryGetValue(node, fo.key),
            indefinite: fo.indefinite,
            nodeId: node.id,
            connected: false,
        })),
        valueInputs: (valueInputs || []).flatMap<IPortUIData>(vi => {
            if (vi.indefinite && node.fieldData) {
                return node.fieldData
                    .filter(x => x.key.includes('|'))
                    .map<IPortUIData>(fd => ({
                        id: fd.key,
                        name: vi.label,
                        io: 'input',
                        type: 'value',
                        valueType: fd.valueType || vi.valueType,
                        defaultValue: vi.defaultValue,
                        indefinite: vi.indefinite,
                        value: tryGetValue(node, fd.key, vi.defaultValue),
                        nodeId: node.id,
                        connected: false,
                        isEditable:
                            vi.isEditable === undefined ? true : vi.isEditable,
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
                    nodeId: node.id,
                    connected: false,
                    isEditable:
                        vi.isEditable === undefined ? true : vi.isEditable,
                },
            ];
        }),
        valueOutputs: (valueOutputs || []).flatMap<IPortUIData>(vo => {
            if (vo.indefinite && node.fieldData) {
                return node.fieldData
                    .filter(x => x.key.includes('|'))
                    .map<IPortUIData>(fd => ({
                        id: fd.key,
                        name: vo.label,
                        io: 'output',
                        type: 'value',
                        value: fd.value || tryGetValue(node, vo.key),
                        valueType: fd.valueType || vo.valueType,
                        indefinite: vo.indefinite,
                        nodeId: node.id,
                        connected: false,
                    }));
            }

            return [
                {
                    id: vo.key,
                    name: vo.label,
                    io: 'output',
                    type: 'value',
                    valueType: vo.valueType,
                    value: tryGetValue(node, vo.key),
                    connected: false,
                    indefinite: vo.indefinite,
                    nodeId: node.id,
                },
            ];
        }),
        title: definition.title,
        permanent: node.permanent,
        selected: false,
    };
};

export const getPortId = ({ nodeId, id }: { nodeId: string; id: string }) =>
    `${nodeId}-${id}`;
