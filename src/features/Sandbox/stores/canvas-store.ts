import { Store } from 'overstated';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
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
    linkType?: PortType;
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

    public drawLinkManager: DrawLinkManager;

    private _nodes: Map<string, INodeUIDataWithLinks> = new Map();
    private _links: Map<string, LinkController> = new Map();

    private canvasElement: HTMLDivElement;
    private selectController: SelectionController;
    private canvasController: CanvasController;
    private bounds: Dimensions;
    private zoomBounds?: ZoomBounds;

    constructor() {
        super();

        this.drawLinkManager = new DrawLinkManager(
            () => this.mousePos,
            this.getLinkByNode,
            this.removeLink,
            coords => this.canvasController.convertCoordinates(coords),
            this.getNode,
            this.addLink,
            errorMessage => {
                console.log(errorMessage);
            }
        );
    }

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
            this.handleCanvasDown,
            this.onCanvasMouseUp,
            this.onCanvasRightClick
        );

        this.selectController = new SelectionController(
            this.canvasController,
            this.handleSelection
        );
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
        const node = this._nodes.get(nodeId);
        if (node) {
            return (
                node.links &&
                node.links.firstOrDefault(
                    x =>
                        x.destinationPortId === portId ||
                        x.sourcePortId === portId
                )
            );
        }

        return undefined;
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

        const sourceNode = this._nodes.get(source.node.id);
        if (sourceNode) {
            if (sourceNode.links) {
                sourceNode.links.push(linkController);
            } else {
                sourceNode.links = [linkController];
            }
        }

        const destinationNode = this._nodes.get(destination.node.id);
        if (destinationNode) {
            if (destinationNode.links) {
                destinationNode.links.push(linkController);
            } else {
                destinationNode.links = [linkController];
            }
        }

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

        this.suspend();
        for (const link of links) {
            // const sourceNode = this._nodes.get(link.sourceNodeId);
            // const destinationNode = this._nodes.get(link.destinationNodeId);
            // if (!sourceNode || !destinationNode) {
            //     continue;
            // }
            // const sourcePort = sourceNode.ports.get(link.sourceData.id);
            // const destinationPort = destinationNode.ports.get(
            //     link.destinationData.id
            // );
            // if (!sourcePort || !destinationPort) {
            //     continue;
            // }
            // this.addLink(
            //     {
            //         node: sourceNode,
            //         data: sourcePort.port,
            //         element: sourcePort.element,
            //     },
            //     {
            //         node: destinationNode,
            //         data: destinationPort.port,
            //         element: destinationPort.element,
            //     }
            // );
        }
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

    public editNode = (id: string) => {
        this.ctx.nodeInfoStore.toggleOpen(true);
        this.ctx.nodeInfoStore.setSelectedNode(this._nodes.get(id)!);
    };

    public removeLink = (linkId: string) => {
        const link = this._links.get(linkId);
        if (link) {
            this.removeLinkFromNode(link.sourceNodeId, linkId);
            this.removeLinkFromNode(link.destinationNodeId, linkId);
        }
    };

    private removeLinkFromNode = (nodeId: string, linkId: string) => {
        const node = this._nodes.get(nodeId);
        if (node && node.links) {
            node.links = node.links.filter(x => x.id !== linkId);
        }
    };

    public removeNode = (nodeId: string) => {
        const node = this._nodes.get(nodeId);
        if (node) {
            if (node.links) {
                node.links.forEach(l => {
                    this.removeLinkFromNode(
                        l.getOppositeNodeIdFromId(nodeId),
                        l.id
                    );
                });
            }
            this._nodes.delete(nodeId);
        }
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

    private updateNode = (
        id: string,
        newDataFunc: (node: INodeUIData) => Partial<INodeUIData>
    ) => {
        const oldNode = this.getNode(id);
        if (oldNode) {
            const newNode = { ...oldNode, ...newDataFunc(oldNode) };
            this._nodes.set(id, newNode);
            this.setState({ nodes: Array.from(this._nodes.values()) });
        }
    };

    private updateNodePort = (
        node: INodeUIData,
        port: PortDataSlim,
        newPortData: Partial<IPortUIData>
    ): Partial<INodeUIData> => {
        let portListName: keyof INodeUIData['portData'];
        // tslint:disable-next-line: prefer-conditional-expression
        if (port.type === 'flow') {
            portListName = port.io === 'input' ? 'flowInputs' : 'flowOutputs';
        } else {
            portListName = port.io === 'input' ? 'valueInputs' : 'valueOutputs';
        }

        const list = node.portData[portListName];
        const existingPort = list.first(x => x.id === port.id);

        return {
            portData: {
                ...node.portData,
                [portListName]: [
                    ...node.portData[portListName].filter(
                        p => p.id !== port.id
                    ),
                    {
                        ...existingPort,
                        ...newPortData,
                    },
                ],
            },
        };
    };

    private handleSelection = (bounds: Bounds) => {};

    public onPortAdd = (data: PortDataSlim) => {};

    public onPortRemove = (data: PortDataSlim) => {};

    public onPortEvent = (
        type: PortEvent,
        element: HTMLElement,
        data: PortDataSlim,
        nodeId: string
    ) => {
        const node = this.getNode(nodeId);
        if (node) {
            this.canvasController.toggleDragging(false);
            this.drawLinkManager.toggleDraw(type, element, data, node);
            this.updateNode(nodeId, oldNode =>
                this.updateNodePort(oldNode, data, { connected: true })
            );
            this.setState({ isDrawingLink: true, linkType: data.type });
        }
    };

    public stopDrawingLink = () => {
        this.drawLinkManager.stopDrawing();
        this.canvasController.toggleDragging(true);
        this.setState({ isDrawingLink: false, linkType: undefined });
    };

    //#region  Canvas Events

    private handleCanvasDown = (event: MouseEvent) => {
        if (event.ctrlKey) {
            this.canvasController.toggleDragging(false);
            this.selectController.startSelect(this.canvasController.mousePos);
        }
    };

    private onCanvasMouseUp = (event: MouseEvent) => {
        if (this.selectController.selecting) {
            this.selectController.stopSelect(this.canvasController.mousePos);
            this.canvasController.toggleDragging(true);
        }
    };

    private onCanvasRightClick = (event: MouseEvent) => {
        if (this.state.isDrawingLink) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.stopDrawingLink();
        }
    };

    //#endregion
}
