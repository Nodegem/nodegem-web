import { Node } from "../../../Node";
import { LinkOptions } from "../../../Link";

export const getSaveGraphData = (graphName: string, { nodes, links } : { nodes: Array<Node>, links: Array<LinkOptions> }) : SaveGraphData => {
    return {
        name: graphName,
        nodes: nodes.map<SaveNodeData>(x => ({ id: x.id, type: x.type, 
            position: { x: x.position[0], y: x.position[1] }, fieldData: x.getInputPortValues() })),
        links: links.map<SaveLinkData>(x => ({ sourceId: x.source.node.id, sourceKey: x.source.port.key, 
            destinationId: x.destination.node.id, destinationKey: x.destination.port.key }))
    };
}