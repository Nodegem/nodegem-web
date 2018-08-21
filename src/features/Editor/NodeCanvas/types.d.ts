import { XYCoords } from "../utils/types";

export type CanvasData = {
    nodes: NodeData[];
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
    sourceNodeId: string;
    sourceFieldId: string;
    toNodeId: string;
    toFieldId: string;
}