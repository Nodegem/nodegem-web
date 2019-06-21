import { NodeImportExport } from 'src/features/Editor/rete-engine/node';
import { LinkImportExport } from '../../../rete-engine/link';

interface TransformMacroArgs {
    id: string;
    nodes: NodeImportExport[];
    links: LinkImportExport[];
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
}: TransformMacroArgs): RunMacroData => {
    const graphTransform = transformGraph({ id, nodes, links });
    return {
        ...graphTransform,
        flowInputs,
        flowOutputs,
        valueInputs,
        valueOutputs,
    };
};

interface TransformGraphArgs {
    id: string;
    nodes: NodeImportExport[];
    links: LinkImportExport[];
}

export const transformGraph = ({
    id,
    nodes,
    links,
}: TransformGraphArgs): RunGraphData => {
    return {
        id: id,
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
        links: links,
    };
};

const isNodeConnected = (
    link: LinkImportExport,
    node: NodeImportExport
): boolean => {
    return link.destinationNode === node.id || link.sourceNode === node.id;
};
