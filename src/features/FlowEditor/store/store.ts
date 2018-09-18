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

    public addLink = action((link: LinkOptions) => {
        this.links.push(link);
    })

    public clear = action(() : void => {
        this.links.forEach(x => x.remove());
        this.nodes.forEach(x => x.remove());
        this.links = [];
        this.nodes = [];
        this.graph.reset();
    })
}

export const store = new FlowEditorStore();