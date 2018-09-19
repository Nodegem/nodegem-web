import { observable, action } from "mobx";
import { DrawingConnection } from "../types";
import { Node } from '../Node';
import { Graph } from "../Graph";
import { LinkOptions } from "../Link";
import { NodeDefinition, createNodeFromDefinition } from "../utils/data-transform/node-definition";
import { graphService } from "../services/graph-service";
import { Menu, Item } from "../FlowContextMenu/FlowContextMenuView";
import { flowContextStore } from "./flow-context-store";

class FlowEditorStore {

    @observable nodes: Array<Node> = [];
    @observable links: Array<LinkOptions> = [];
    @observable linking?: DrawingConnection;
    @observable focused: boolean = false;

    graph: Graph = new Graph();
    graphContextMenu: Menu = { items: [] };

    constructor() {
        graphService.getNodeDefinitions().then(data => {
            this.graphContextMenu = this.generateContextMenu(data);
        });
    }

    private generateContextMenu = (nodeDefinitions: Array<NodeDefinition>) : Menu => {
        const nodeItems = nodeDefinitions.map(x => ({
            label: x.title,
            action: () => this.createNodeAction(x, flowContextStore.position),
            disabled: false
        } as Item))

        return {
            items: nodeItems
        };
    }

    private createNodeAction = (node: NodeDefinition, position: XYCoords) => {
        this.addNode(createNodeFromDefinition(node, this.graph.convertCoords(position)));
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

export const flowEditorStore = new FlowEditorStore();