import { LinkOptions } from "../../../Link";
import { Node } from "../../../Node";

export const transformGraph = (nodes: Array<Node>, links: Array<LinkOptions>) : RunGraphData => {
    return {
        nodes: nodes.filter(n => links.some(l => l.source.node === n || l.destination.node === n))
            .map(x => 
            ({ id: x.id, type: x.type, fields: x.inputValuePorts.filter(fiv => !fiv.connected).map(iv => ({ key: iv.key, value: iv.value })) })
        ),
        connections: links.map(x => 
            ({ source: x.source.node.id, sourceKey: x.source.port.key, destination: x.destination.node.id, destinationKey: x.destination.port.key })
        )
    }
}