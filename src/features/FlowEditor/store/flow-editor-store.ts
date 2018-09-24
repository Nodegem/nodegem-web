import { getSaveGraphData } from './../services/data-transform/save-graph/index';
import { graphService } from './../services/graph-service';
import { observable, action } from "mobx";
import { DrawingConnection } from "../types";
import { Node } from '../Node';
import { Graph } from "../Graph";
import { LinkOptions, FlowLink, ValueLink } from "../Link";
import { Menu, Item } from "../FlowContextMenu/FlowContextMenuView";
import { flowContextStore } from "./flow-context-store";
import { AnyPort } from "../Node/Ports/types";
import { createNodeFromDefinition } from "../services/data-transform/node-definitions";
import { OutputFlowPort, OutputValuePort, InputFlowPort, InputValuePort } from '../Node/Ports';
import _ from "lodash";

class FlowEditorStore {

    @observable nodes: Array<Node> = [];
    @observable links: Array<LinkOptions> = [];
    @observable linking?: DrawingConnection;
    @observable focused: boolean = false;

    graph: Graph = new Graph();
    nodeDefinitions: { [type: string] : NodeDefinition };
    graphContextMenu: Menu = { items: [] };

    constructor() {
        this.init()
    }

    private async init() {
        const defs = await Promise.resolve([] as Array<NodeDefinition>);//await graphService.getNodeDefinitions();
        this.nodeDefinitions = defs.reduce((map, obj) => {
            map[obj.type] = obj;
            return map;
        }, {});
        this.graphContextMenu = this.generateContextMenu(defs);
    }

    public saveGraph = async () : Promise<void> => {
        const saveGraphData = getSaveGraphData("This is a new graph yo", this);
        console.log(saveGraphData);
        const graph = await graphService.newGraph(saveGraphData);
    }

    public loadGraph = async () : Promise<void> => {
        this.clearGraph();
        const graph = await graphService.getGraph("1c7b7602-d76a-457b-821c-26066fad0208");

        graph.nodes.forEach(n => {
            const def = this.nodeDefinitions[n.type];
            const { x, y } = n.position;
            const node = this.buildNode(def, [x, y], false);

            if(n.fieldData) {
                n.fieldData.forEach(fd => node.setInputPortValue(fd.key, fd.value));
            }
            
            node.setId(n.id);
            this.addNode(node);
        });

        graph.links.forEach(l => {
            const sourceNode = this.nodes.find(x => x.id === l.sourceId)!;
            const sourcePort = sourceNode.getPortByKey(l.sourceKey);
            const destinationNode = this.nodes.find(x => x.id === l.destinationId)!;
            const destinationPort = destinationNode.getPortByKey(l.destinationKey);

            const link = sourcePort.type === "flow" 
                ? new FlowLink({ node: sourceNode, port: sourcePort as OutputFlowPort }, { node: destinationNode, port: destinationPort as InputFlowPort })
                : new ValueLink({ node: sourceNode, port: sourcePort as OutputValuePort }, { node: destinationNode, port: destinationPort  as InputValuePort });

            this.addLink(link);
        });

        this.graph.resetMount(75);
    }

    private generateContextMenu = (nodeDefinitions: Array<NodeDefinition>) : Menu => {
        const nodeItems = nodeDefinitions.map(x => ({
            label: x.title,
            action: () => this.buildAndAddNode(x, flowContextStore.position),
            disabled: false
        } as Item))

        return {
            items: nodeItems
        };
    }

    private buildNode = (node: NodeDefinition, position: XYCoords, shouldConvertCoords: boolean = true) : Node => {
        const coords = shouldConvertCoords ? this.graph.convertCoords(position) : position;
        return createNodeFromDefinition(node, coords);
    }

    private buildAndAddNode = (node: NodeDefinition, position: XYCoords) : void => {
        this.addNode(this.buildNode(node, position));
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

    public clearGraph = action(() : void => {
        this.links.forEach(x => this.removeLink(x));
        this.nodes.forEach(x => this.removeNode(x));
        this.links = [];
        this.nodes = [];
        this.graph.reset();
    })

}

export const flowEditorStore = new FlowEditorStore();