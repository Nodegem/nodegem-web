import { observable, action } from "mobx";
import { DrawingConnection } from "../types";
import { Node } from '../Node';
import { Graph } from "../Graph";
import { LinkOptions } from "../Link";
import { NodeDefinition } from "../utils/data-transform/node-definition";
import { graphService } from "../services/graph-service";

class FlowEditorStore {

    @observable nodes: Array<Node> = [];
    @observable links: Array<LinkOptions> = [];
    @observable linking?: DrawingConnection;

    graph: Graph = new Graph();
    nodeDefinitions: Array<NodeDefinition> = [];

    constructor() {
        graphService.getNodeDefinitions().then(data => {
            this.nodeDefinitions = data;
        });
    }

    public addNode = action((node: Node) => {
        this.nodes.push(node);
    })
}

export const store = new FlowEditorStore();