import { LinkOptions } from "../../../Link";
import { Node } from "../../../Node";

export const transformGraph = (nodes: Array<Node>, links: Array<LinkOptions>) : RunGraphData => {
    return {
        nodes: nodes.filter(n => links.some(l => l.source.node === n || l.destination.node === n))
            .map(x => 
            ({ id: x.id, namespace: x.type, fieldData: x.getInputPortValues() })
        ),
        connections: links.map(x => 
            ({ source: x.source.node.id, sourceKey: x.source.port.key, destination: x.destination.node.id, destinationKey: x.destination.port.key })
        )
    }
}