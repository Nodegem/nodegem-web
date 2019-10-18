import { Store } from 'overstated';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { waitWhile } from 'utils';
import LinkController from '../Link/link-controller';
import NodeController from '../Node/node-controller';
import { nodeSelectDroppableId } from '../NodeSelect';
import { ZoomBounds } from '../Sandbox/Canvas';
import CanvasController from '../Sandbox/Canvas/canvas-controller';
import SelectionController from '../Sandbox/Canvas/selection-controller';
import { sandboxDroppableId } from '../Sandbox/SandboxCanvas';
import { definitionToNode } from '../utils';
import { SandboxStore } from './sandbox-store';

interface IGraphState {
    graph: Graph | Macro;
    nodes: NodeController[];
    links: LinkController[];
    hasLoadedGraph: boolean;
}

export class GraphStore extends Store<IGraphState, SandboxStore> {
    public state: IGraphState = {
        nodes: [],
        links: [],
        hasLoadedGraph: false,
    } as any;

    public get mousePos(): Vector2 {
        return this._canvasController.mousePos;
    }

    public get nodeCache(): NodeCache {
        const { hasActiveTab, activeTab } = this.ctx.stateStore;
        return (hasActiveTab && activeTab.definitions) || ({} as any);
    }

    private _nodes: Map<string, NodeController> = new Map();
    private _links: Map<string, LinkController> = new Map();

    private canvasElement: HTMLDivElement;
    private selectController: SelectionController;
    private _canvasController: CanvasController;
    private bounds: Dimensions;
    private zoomBounds?: ZoomBounds;

    public bindElement = (
        element: HTMLDivElement,
        bounds: Dimensions,
        zoomBounds?: ZoomBounds
    ) => {
        this.canvasElement = element;
        this.bounds = bounds;
        this.zoomBounds = zoomBounds;

        this._canvasController = new CanvasController(
            element,
            this.bounds,
            this.zoomBounds,
            this.handleCanvasDown
        );
        this.selectController = new SelectionController(
            this._canvasController,
            this.handleSelection
        );

        element.parentElement!.addEventListener(
            'mousedown',
            this.handleMouseDown
        );
        element.parentElement!.addEventListener('mouseup', this.handleMouseUp);
    };

    public onCanvasDrag = (
        result: DropResult,
        provided: ResponderProvided
    ): void => {
        const { hasActiveTab } = this.ctx.stateStore;
        if (!hasActiveTab || !result.destination) {
            return;
        }
        if (
            result.source.droppableId.startsWith(nodeSelectDroppableId) &&
            result.destination.droppableId === sandboxDroppableId
        ) {
            this.createNodeFromDefinition(result.draggableId, false);
        }
    };

    public createNodeFromDefinition = (
        nodeDefinitionId: string,
        centered = false
    ) => {
        const { definitionLookup } = this.nodeCache;

        const node = definitionToNode(
            definitionLookup[nodeDefinitionId],
            centered ? { x: 0, y: 0 } : this.mousePos
        );

        this.addNode(node);
    };

    public addNode = (node: INodeUIData) => {
        const controller = new NodeController(
            node,
            this._canvasController,
            () => {},
            this.onNodeMove,
            this.handleNodeDblClick,
            this.handleNodeClick,
            () => {}
        );

        this._nodes.set(node.id, controller);
    };

    public addLink = (
        source: {
            element: HTMLElement;
            data: IPortUIData;
            node: NodeController;
        },
        destination: {
            element: HTMLElement;
            data: IPortUIData;
            node: NodeController;
        }
    ) => {
        const linkController = new LinkController(
            {
                source: source.element,
                sourceData: source.data,
                sourceNodeId: source.node.id,
                destination: destination.element,
                destinationData: destination.data,
                destinationNodeId: destination.node.id,
            },
            source.data.type,
            this._canvasController
        );

        this._links.set(linkController.id, linkController);
        const sourceNode = this._nodes.get(linkController.sourceNodeId);
        const destinationNode = this._nodes.get(
            linkController.destinationNodeId
        );

        if (sourceNode) {
            sourceNode.addLink(linkController);
        }

        if (destinationNode) {
            destinationNode.addLink(linkController);
        }
    };

    public async load(nodes: INodeUIData[], links: ILinkInitializeData[]) {
        this.clearView();
        for (const node of nodes) {
            this.addNode(node);
        }

        await this.updateNodesFromMap();
        await waitWhile(() => this.state.nodes.every(n => n.hasLoaded));

        for (const link of links) {
            const sourceNode = this._nodes.get(link.sourceNodeId);
            const destinationNode = this._nodes.get(link.destinationNodeId);
            if (!sourceNode || !destinationNode) {
                continue;
            }

            const sourcePort = sourceNode.ports.get(link.sourceData.id);
            const destinationPort = destinationNode.ports.get(
                link.destinationData.id
            );

            if (!sourcePort || !destinationPort) {
                continue;
            }

            this.addLink(
                {
                    node: sourceNode,
                    data: sourcePort.port,
                    element: sourcePort.element,
                },
                {
                    node: destinationNode,
                    data: destinationPort.port,
                    element: destinationPort.element,
                }
            );
        }

        await this.updateLinksFromMap();
        this.setState({ hasLoadedGraph: true });
    }

    public clearNodes() {
        this._nodes.forEach(n => n.dispose());
        this._nodes.clear();
    }

    public clearLinks = () => {
        this._links.forEach(l => l.dispose());
        this._links.clear();
    };

    public resetView = () => {
        this._canvasController.reset();
    };

    public clearView() {
        this.clearNodes();
        this.clearLinks();
        this.setState({ hasLoadedGraph: false });
    }

    private async updateNodesFromMap() {
        await this.setState({ nodes: Array.from(this._nodes.values()) });
    }

    private async updateLinksFromMap() {
        await this.setState({ links: Array.from(this._links.values()) });
    }

    public onNodeMove = (node: NodeController) => {
        node.updateLinks();
    };

    private handleCanvasDown = (event: MouseEvent) => {
        // this._selectedNodes = [];
        // this.onCanvasDown(event);
    };

    public removeNode = (nodeId: string) => {
        const node = this._nodes.get(nodeId);
        // if (node) {
        //     node.links.forEach(x => this.removeLink(x.id));
        //     node.dispose();
        //     this._nodes.delete(nodeId);
        // }
    };

    private handleNodeClick = (event: MouseEvent, node: NodeController) => {
        // if (event.ctrlKey) {
        //     this._selectedNodes.push(node);
        // } else {
        //     this._selectedNodes = [node];
        // }
    };

    private handleNodeDblClick = (node: NodeController) => {
        // this._selectedNodes = [node];
    };

    private handleSelection = (bounds: Bounds) => {};

    private handleMouseDown = (event: MouseEvent) => {
        if (event.ctrlKey) {
            this._canvasController.toggleDragging(false);
            this.selectController.startSelect(this._canvasController.mousePos);
        }
    };

    private handleMouseUp = (event: MouseEvent) => {
        if (this.selectController.selecting) {
            this.selectController.stopSelect(this._canvasController.mousePos);
            this._canvasController.toggleDragging(true);
        }
    };
}
