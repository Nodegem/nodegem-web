import { observable, action } from "mobx";
import { DrawingConnection } from "../types";
import { Node } from '../Node';
import { Graph } from "../Graph";
import { LinkOptions } from "../Link";
import { graphService } from "../services/graph-service";
import { Menu, Item } from "../FlowContextMenu/FlowContextMenuView";
import { flowContextStore } from "./flow-context-store";
import { AnyPort } from "../Node/Ports/types";
import _ from "lodash";
import { createNodeFromDefinition, NodeDefinition } from "../services/data-transform/node-definition";

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
        link.source.node.addLink(link);
        link.destination.node.addLink(link);
        this.links.push(link);
    })

    public removeNode = action((node: Node) => {
        node.remove();
        _.remove(this.nodes, node);
    })

    public removeLink = action((link: LinkOptions) => {
        link.source.node.removeLink(link);
        link.destination.node.removeLink(link);
        _.remove(this.links, link);
    })

    public isCurrentlyBeingLinked = (port: AnyPort) : boolean => {
        return !!this.linking && this.linking.from === port;
    }

    public clear = action(() : void => {
        this.links.forEach(x => this.removeLink(x));
        this.nodes.forEach(x => this.removeNode(x));
        this.links = [];
        this.nodes = [];
        this.graph.reset();
    })

}

export const flowEditorStore = new FlowEditorStore();