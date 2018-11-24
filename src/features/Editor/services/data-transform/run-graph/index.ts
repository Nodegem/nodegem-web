import { LinkImportExport } from './../../../rete-engine/link';
import { NodeImportExport } from 'src/features/Editor/rete-engine/node';
import { EditorImportExport } from 'src/features/Editor/rete-engine/editor';

export const transformGraph = ({id, nodes, links} : { id: string, nodes: Array<NodeImportExport>, links: Array<LinkImportExport>}) : RunGraphData => {
    return {
        id: id,
        nodes: nodes.reduce((prev, cur) => {
            prev.push({
                id: cur.id,
                namespace: cur.namespace,
                fieldData: cur.fieldData
            } as RunNodeData);
            return prev;
        }, [] as Array<RunNodeData>),
        links: links.reduce((prev, cur) => {
            prev.push(cur);
            return prev;
        }, [] as Array<RunLinkData>)
    }
}