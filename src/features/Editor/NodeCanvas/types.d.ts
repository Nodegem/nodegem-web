import { XYCoords } from "../utils/types";

export type CanvasData = {
    nodes: { [nodeId: string] : NodeData };
    connectors: ConnectorData[];
}

export type NodeData = {
    id: string;
    title: string;
    inputs: IOData[];
    outputs: IOData[];
    position: XYCoords;
}

export type IOData = {
    label: string;
    id: string;
}

export type ConnectorData = {
    sourceNode: string;
    sourceFieldId: string;
    endNode: string;
    endFieldId: string;
}