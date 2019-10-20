import { action, computed, observable } from 'mobx';
import { waitWhile } from 'utils';
import LinkController from '../Link/link-controller';
import NodeController from '../Node/node-controller';
import CanvasController, { ZoomBounds } from './Canvas/canvas-controller';
import SelectionController from './Canvas/selection-controller';

class SandboxManager implements IDisposable {
    @computed
    public get nodes(): NodeController[] {
        return Array.from(this._nodes.values());
    }

    @observable
    private _nodes: Map<string, NodeController> = new Map();

    @observable
    private _links: Map<string, LinkController> = new Map();

    @observable
    private _selectedNodes: NodeController[] = [];

    @computed
    public get links(): LinkController[] {
        return Array.from(this._links.values());
    }

    @computed
    public get selectedNodes(): NodeController[] {
        return this._selectedNodes;
    }

    @computed
    public get firstSelectedNode(): NodeController | undefined {
        return (
            (this._selectedNodes &&
                !this._selectedNodes.empty() &&
                this.selectedNodes[0]) ||
            undefined
        );
    }

    public get mousePos(): Vector2 {
        return this._canvasController.mousePos;
    }

    private _hasBeenInitialized = false;
    public get hasBeenInitialized() {
        return this._hasBeenInitialized;
    }

    private _canvasElement: HTMLDivElement;

    public get canvasElement(): HTMLDivElement {
        return this._canvasElement;
    }

    public get canvasController(): CanvasController {
        return this._canvasController;
    }

    private selectController: SelectionController;
    private _canvasController: CanvasController;
    private bounds: Dimensions;
    private zoomBounds?: ZoomBounds;

    private hasLoadedGraph = false;

    constructor(
        private onPortEvent: (
            event: PortEvent,
            element: HTMLElement,
            data: IPortUIData,
            node: NodeController
        ) => void,
        private onCanvasDown: (event: MouseEvent) => void,
        private onNodeDblClick: (node: NodeController) => void
    ) {}

    public setProperties(
        element: HTMLDivElement,
        bounds: Dimensions,
        zoomBounds?: ZoomBounds
    ) {
        if (this.hasBeenInitialized) {
            return;
        }

        this._canvasElement = element;
        this.bounds = bounds;
        this.zoomBounds = zoomBounds;

        // this._canvasController = new CanvasController(
        //     element,
        //     this.bounds,
        //     this.zoomBounds,
        //     this.handleCanvasDown
        // );
        this.selectController = new SelectionController(
            this._canvasController,
            this.handleSelection
        );

        element.parentElement!.addEventListener(
            'mousedown',
            this.handleMouseDown
        );
        element.parentElement!.addEventListener('mouseup', this.handleMouseUp);
        this._hasBeenInitialized = true;
    }

    public convertCoordinates = (coords: Vector2) => {
        return this._canvasController.convertCoordinates(coords);
    };

    @action
    public addNode = (node: INodeUIData) => {
        this._nodes.set(
            node.id,
            new NodeController(
                node,
                this._canvasController,
                this.handlePortEvent,
                this.onNodeMove,
                this.handleNodeDblClick,
                this.handleNodeClick,
                this.handlePortActionEvent
            )
        );
    };

    public getNode = (nodeId: string) => this._nodes.get(nodeId);

    @action
    private handlePortActionEvent = (
        portAction: 'add' | 'remove',
        node: NodeController,
        port?: IPortUIData
    ) => {};

    @action
    public removeNode = (nodeId: string) => {
        const node = this._nodes.get(nodeId);
        if (node) {
            node.links.forEach(x => this.removeLink(x.id));
            node.dispose();
            this._nodes.delete(nodeId);
        }
    };

    @action
    private handleNodeClick = (event: MouseEvent, node: NodeController) => {
        if (event.ctrlKey) {
            this._selectedNodes.push(node);
        } else {
            this._selectedNodes = [node];
        }
    };

    @action
    private handleNodeDblClick = (node: NodeController) => {
        this._selectedNodes = [node];
        this.onNodeDblClick(node);
    };

    @action
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

    public getLinkByNode = (nodeId: string, portId: string) => {
        const node = this.getNode(nodeId);
        if (node) {
            const link = node.links.find(
                x => x.sourcePortId === portId || x.destinationPortId === portId
            );
            return link;
        }

        return undefined;
    };

    public getLink = (linkId: string) => this._links.get(linkId);

    @action
    public removeLink = (linkId: string) => {
        const link = this._links.get(linkId);
        if (link) {
            const sourceNode = this.getNode(link.sourceNodeId);
            const destinationNode = this.getNode(link.destinationNodeId);
            if (sourceNode) {
                sourceNode.removeLink(link);
            }
            if (destinationNode) {
                destinationNode.removeLink(link);
            }
            link.dispose();
            this._links.delete(linkId);
        }
    };

    @action
    public clearLinks = () => {
        this._links.forEach(l => l.dispose());
        this._links.clear();
    };

    @action
    public async load(nodes: INodeUIData[], links: ILinkInitializeData[]) {
        this.clearView();
        for (const node of nodes) {
            this.addNode(node);
        }

        await waitWhile(() => this.nodes.every(n => n.hasLoaded));

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

        this.hasLoadedGraph = true;
    }

    public onNodeMove = (node: NodeController) => {
        node.updateLinks();
    };

    public clearView() {
        this.clearNodes();
        this.clearLinks();
        this.hasLoadedGraph = false;
    }

    private handleCanvasDown = (event: MouseEvent) => {
        this._selectedNodes = [];
        this.onCanvasDown(event);
    };

    private handleSelection = (bounds: Bounds) => {};

    private handlePortEvent = (
        event: PortEvent,
        element: HTMLElement,
        data: IPortUIData,
        node: NodeController
    ) => {
        this.onPortEvent(event, element, data, node);
    };

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

    public resetView = () => {
        this._canvasController.reset();
    };

    public magnify(zoomAmount: number) {
        this._canvasController.magnify(zoomAmount);
    }

    public clearNodes() {
        this._nodes.forEach(n => n.dispose());
        this._nodes.clear();
    }

    public dispose(): void {
        this.clearView();
        this._canvasController.dispose();
        this.selectController.dispose();
        this._canvasElement.parentElement!.removeEventListener(
            'mousedown',
            this.handleMouseDown
        );
        this._canvasElement.parentElement!.removeEventListener(
            'mouseup',
            this.handleMouseUp
        );
        this._hasBeenInitialized = false;
    }
}

export default SandboxManager;
