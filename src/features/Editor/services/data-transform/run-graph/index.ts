import { NodeImportExport } from 'src/features/Editor/rete-engine/node';
import { LinkImportExport } from '../../../rete-engine/link';

interface ITransformMacroArgs extends ITransformGraphArgs {
    flowInputs: FlowInputFieldDto[];
    flowOutputs: FlowOutputFieldDto[];
    valueInputs: ValueInputFieldDto[];
    valueOutputs: ValueOutputFieldDto[];
}

export const transformMacro = ({
    id,
    nodes,
    links,
    flowInputs,
    flowOutputs,
    valueInputs,
    valueOutputs,
    isDebugModeEnabled,
}: ITransformMacroArgs): RunMacroData => {
    const graphTransform = transformGraph({
        id,
        nodes,
        links,
        isDebugModeEnabled,
    });
    return {
        ...graphTransform,
        flowInputs,
        flowOutputs,
        valueInputs,
        valueOutputs,
    };
};

interface ITransformGraphArgs {
    id: string;
    nodes: NodeImportExport[];
    links: LinkImportExport[];
    isDebugModeEnabled: boolean;
}

export const transformGraph = ({
    id,
    nodes,
    links,
    isDebugModeEnabled,
}: ITransformGraphArgs): RunGraphData => {
    return {
        id,
        nodes: nodes
            .filter(n => links.some(l => isNodeConnected(l, n)))
            .reduce(
                (prev, cur) => [
                    ...prev,
                    {
                        id: cur.id,
                        fullName: cur.fullName,
                        fieldData: cur.fieldData,
                        macroId: cur.macroId,
                        macroFieldId: cur.macroFieldId,
                    } as RunNodeData,
                ],
                [] as Array<RunNodeData>
            ),
        links,
        isDebugModeEnabled,
    };
};

const isNodeConnected = (
    link: LinkImportExport,
    node: NodeImportExport
): boolean => {
    return link.destinationNode === node.id || link.sourceNode === node.id;
};
