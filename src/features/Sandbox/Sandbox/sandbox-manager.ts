import { action, computed, observable } from 'mobx';
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

    @computed
    public get links(): LinkController[] {
        return Array.from(this._links.values());
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

    constructor(
        private onSelection: (bounds: Bounds) => void,
        private onPortEvent: (
            event: PortEvent,
            element: HTMLElement,
            data: IPortUIData,
            node: NodeController
        ) => void
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

        this._canvasController = new CanvasController(
            element,
            this.bounds,
            this.zoomBounds
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
                this.onNodeMove
            )
        );
    };

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

    @action
    public removeLink = (linkId: string) => {
        const link = this._links.get(linkId);
        if (link) {
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
    public load(data: INodeUIData[]) {
        this.clearView();
        for (const node of data) {
            this.addNode(node);
        }
    }

    @action
    public onNodeMove = (node: NodeController) => {
        node.updateLinks();
    };

    @action
    public clearView() {
        this.clearNodes();
        this.clearLinks();
    }

    private handleSelection = (bounds: Bounds) => {
        this.onSelection(bounds);
    };

    private handlePortEvent = (
        event: PortEvent,
        element: HTMLElement,
        data: IPortUIData,
        node: NodeController
    ) => {
        console.log(data);
        this.onPortEvent(event, element, data, node);
    };

    private handleMouseDown = (event: MouseEvent) => {
        if (event.ctrlKey) {
            this._canvasController.disableDrag();
            this.selectController.startSelect(this._canvasController.mousePos);
        }
    };

    private handleMouseUp = (event: MouseEvent) => {
        if (this.selectController.selecting) {
            this.selectController.stopSelect(this._canvasController.mousePos);
        }
    };

    @action
    public resetView() {
        this._canvasController.reset();
    }

    @action
    public clearNodes() {
        this._nodes.forEach(n => n.dispose());
        this._nodes.clear();
    }

    public dispose(): void {
        this.clearNodes();
        this.clearLinks();
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
