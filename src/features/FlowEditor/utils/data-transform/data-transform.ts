import { Node } from "../../Node";
import { LinkOptions } from "../../Link";

interface GraphData {
    nodes: Array<NodeData>;
    connections: Array<ConnectionData>;
}

interface ConnectionData {
    source: string;
    sourceKey: string;
    destination: string;
    destinationKey: string;
}

interface NodeData {
    id: string;
    type: string;
    fields: Array<FieldData>;
}

interface FieldData {
    key: string;
    value: any;
}

export { GraphData };

export const transformGraph = (nodes: Array<Node>, links: Array<LinkOptions>) : GraphData => {
    return {
        nodes: nodes.map<NodeData>(x => 
            ({ id: x.id, type: x.type, fields: [] })
        ),
        connections: links.map<ConnectionData>(x => 
            ({ source: x.source.node.id, sourceKey: x.source.port.key, destination: x.destination.node.id, destinationKey: x.destination.port.key })
        )
    }
}