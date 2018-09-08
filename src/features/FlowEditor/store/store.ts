import { observable } from "mobx";
import { Graph } from "../Canvas/Graph";
import { Link } from "../Link";
import { DrawingConnection } from "../types";
import { Node } from '../Node';

class FlowEditorStore {
    @observable nodes: Array<Node> = [];
    @observable links: Array<Link> = [];
    @observable linking: DrawingConnection;

    graph: Graph = new Graph();
}

export const store = new FlowEditorStore();