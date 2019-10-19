import { Store } from 'overstated';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { waitWhile } from 'utils';
import DrawLinkController from '../Link/draw-link-controller';
import LinkController from '../Link/link-controller';
import { DrawLinkManager } from '../managers';
import NodeController from '../Node/node-controller';
import { nodeSelectDroppableId } from '../NodeSelect';
import { ZoomBounds } from '../Sandbox/Canvas';
import CanvasController from '../Sandbox/Canvas/canvas-controller';
import SelectionController from '../Sandbox/Canvas/selection-controller';
import { sandboxDroppableId } from '../Sandbox/SandboxCanvas';
import { definitionToNode } from '../utils';
import { SandboxStore } from './sandbox-store';

interface ICanvasState {
    nodes: INodeUIData[];
    links: LinkController[];
    isLoading: boolean;
    linksVisible: boolean;
    isDrawingLink: boolean;
}

interface INodeUIDataWithLinks extends INodeUIData {
    links?: LinkController[];
}

export class CanvasStore extends Store<ICanvasState, SandboxStore> {
    public state: ICanvasState = {
        nodes: [],
        links: [],
        isLoading: false,
        linksVisible: true,
        isDrawingLink: false,
    };

    public get mousePos(): Vector2 {
        return this.canvasController.mousePos;
    }

    public get nodeCache(): NodeCache {
        const { hasActiveTab, activeTab } = this.ctx.tabsStore;
        return (hasActiveTab && activeTab.definitions) || ({} as any);
    }

    public get isDisabled(): boolean {
        return this.state.isLoading;
    }

    private _nodes: Map<string, INodeUIDataWithLinks> = new Map();
    private _links: Map<string, LinkController> = new Map();

    private canvasElement: HTMLDivElement;
    private selectController: SelectionController;
    private canvasController: CanvasController;
    private drawLinkManager: DrawLinkManager;
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

        this.canvasController = new CanvasController(
            element,
            this.bounds,
            this.zoomBounds,
            this.handleCanvasDown
        );

        this.selectController = new SelectionController(
            this.canvasController,
            this.handleSelection
        );

        // this.drawLinkManager = new DrawLinkManager(
        //     () => this.mousePos,
        //     this.getLinkByNode,
        //     this.remove
        // );

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
        const { hasActiveTab } = this.ctx.tabsStore;
        if (!hasActiveTab || !result.destination) {
            return;
        }
        if (
            result.source.droppableId.startsWith(nodeSelectDroppableId) &&
            result.destination.droppableId === sandboxDroppableId
        ) {
            const { definitionLookup } = this.nodeCache;
            this.createNodeFromDefinition(
                definitionLookup[result.draggableId],
                false
            );
        }
    };

    public createNodeFromDefinition = (
        definition: NodeDefinition,
        centered = false
    ) => {
        const { definitionLookup } = this.nodeCache;

        const node = definitionToNode(
            definitionLookup[definition.fullName],
            centered ? { x: 0, y: 0 } : this.mousePos
        );

        this.addNode(node);
    };

    public addNode = (node: INodeUIData) => {
        this._nodes.set(node.id, node);
        this.setState({ nodes: Array.from(this._nodes.values()) });
    };

    private getNode = (nodeId: string) => {
        return this._nodes.get(nodeId);
    };

    private getLinkByNode = (nodeId: string, portId: string) => {
        // const nodeLinks = this._nodeLinks.get(nodeId);
        // if (nodeLinks) {
        //     return nodeLinks.get(portId);
        // }
        // return undefined;
    };

    public addLink = (
        source: {
            element: HTMLElement;
            data: IPortUIData;
            node: INodeUIData;
        },
        destination: {
            element: HTMLElement;
            data: IPortUIData;
            node: INodeUIData;
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
            this.canvasController
        );

        this._links.set(linkController.id, linkController);

        // const sourceNodeLinks = this._nodeLinks.get(source.node.id);
        // if(sourceNodeLinks) {
        //     sourceNodeLinks.set(source.data.id, linkController);
        // } else {
        //     const newNodeLinkMap = new Map();
        //     newNodeLinkMap.set(source.data.id, linkController);
        //     this._nodeLinks.set(source.node.id, newNodeLinkMap);
        // }

        // const destinationNodeLinks = this._nodeLinks.get(destination.node.id);
        // if(destinationNodeLinks) {
        //     destinationNodeLinks.set(destination.data.id, linkController);
        // } else {
        //     const newNodeLinkMap = new Map();
        //     newNodeLinkMap.set(destination.data.id, linkController);
        //     this._nodeLinks.set(destination.node.id, newNodeLinkMap);
        // }

        this.setState({ links: Array.from(this._links.values()) });
    };

    public async load(nodes: INodeUIData[], links: ILinkInitializeData[]) {
        this.setState({ isLoading: true });

        this.clearView();

        this.suspend();
        for (const node of nodes) {
            this.addNode(node);
        }
        this.unsuspend();

        // await waitWhile(() => this.state.nodes.every(n => n.hasLoaded));

        this.suspend();
        // for (const link of links) {
        //     const sourceNode = this._nodes.get(link.sourceNodeId);
        //     const destinationNode = this._nodes.get(link.destinationNodeId);
        //     if (!sourceNode || !destinationNode) {
        //         continue;
        //     }
        //     const sourcePort = sourceNode.ports.get(link.sourceData.id);
        //     const destinationPort = destinationNode.ports.get(
        //         link.destinationData.id
        //     );
        //     if (!sourcePort || !destinationPort) {
        //         continue;
        //     }
        //     this.addLink(
        //         {
        //             node: sourceNode,
        //             data: sourcePort.port,
        //             element: sourcePort.element,
        //         },
        //         {
        //             node: destinationNode,
        //             data: destinationPort.port,
        //             element: destinationPort.element,
        //         }
        //     );
        // }
        this.unsuspend();

        this.setState({ isLoading: false });
    }

    public onNodePositionUpdate = (position: Vector2) => {};

    public clearNodes() {
        this._nodes.clear();
        this.setState({ nodes: [] });
    }

    public clearLinks = () => {
        this._links.forEach(l => l.dispose());
        this._links.clear();
        this.setState({ links: [] });
    };

    public resetView = () => {
        this.canvasController.reset();
    };

    public clearView() {
        this.clearNodes();
        this.clearLinks();
    }

    public toggleLinkVisibility = (toggle?: boolean) => {
        this.setState({
            linksVisible: this.state.linksVisible.toggle(toggle),
        });
    };

    public onNodeMove = (nodeId: string) => {};

    private handleCanvasDown = (event: MouseEvent) => {
        // this._selectedNodes = [];
        // this.onCanvasDown(event);
    };

    public editNode = (node: INodeUIData) => {
        this.ctx.nodeInfoStore.toggleOpen(true);
        this.ctx.nodeInfoStore.setSelectedNode(this._nodes.get(node.id)!);
    };

    public removeLink = (linkId: string) => {
        const link = this._links.get(linkId);
        if (link) {
            const sourceNode = this._nodes.get(link.sourceNodeId);
        }
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

    public onPortAdd = (data: PortDataSlim) => {};

    public onPortRemove = (data: PortDataSlim) => {};

    public onPortEvent = (
        type: PortEvent,
        element: HTMLElement,
        data: PortDataSlim
    ) => {};

    private handleMouseDown = (event: MouseEvent) => {
        if (event.ctrlKey) {
            this.canvasController.toggleDragging(false);
            this.selectController.startSelect(this.canvasController.mousePos);
        }
    };

    private handleMouseUp = (event: MouseEvent) => {
        if (this.selectController.selecting) {
            this.selectController.stopSelect(this.canvasController.mousePos);
            this.canvasController.toggleDragging(true);
        }
    };
}
