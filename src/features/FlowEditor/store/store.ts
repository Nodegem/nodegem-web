import { observable } from "mobx";
import { Link } from "../Link";
import { DrawingConnection } from "../types";
import { Node } from '../Node';
import { Graph } from "../Graph";

class FlowEditorStore {
    @observable nodes: Array<Node> = [];
    @observable links: Array<Link> = [];
    @observable linking?: DrawingConnection;

    graph: Graph = new Graph();
}

export const store = new FlowEditorStore();