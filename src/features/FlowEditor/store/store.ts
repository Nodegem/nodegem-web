import { observable } from "mobx";
import { DrawingConnection } from "../types";
import { Node } from '../Node';
import { Graph } from "../Graph";
import { LinkOptions } from "../Link";

class FlowEditorStore {
    @observable nodes: Array<Node> = [];
    @observable links: Array<LinkOptions> = [];
    @observable linking?: DrawingConnection;

    graph: Graph = new Graph();
}

export const store = new FlowEditorStore();