import { action, computed, observable } from 'mobx';
import LinkController from '../Link/link-controller';
import NodeController from '../Node/node-controller';
import CanvasController, { ZoomBounds } from './Canvas/canvas-controller';
import SelectionController from './Canvas/selection-controller';

class SandboxManager<TNodeData extends INodeUIData = any>
    implements IDisposable {
    @computed
    public get nodes(): NodeController<TNodeData>[] {
        return Array.from(this._nodes.values());
    }

    @observable
    private _nodes: Map<string, NodeController<TNodeData>> = new Map();

    @observable
    private _links: Map<string, LinkController> = new Map();

    @computed
    public get links(): LinkController[] {
        return Array.from(this._links.values());
    }

    public get mousePos(): Vector2 {
        return this.canvasController.mousePos;
    }

    private _hasBeenInitialized = false;
    public get hasBeenInitialized() {
        return this._hasBeenInitialized;
    }

    private _canvasElement: HTMLDivElement;

    public get canvasElement(): HTMLDivElement {
        return this._canvasElement;
    }

    private selectController: SelectionController;
    private canvasController: CanvasController;
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

        this.canvasController = new CanvasController(
            element,
            this.bounds,
            this.zoomBounds
        );
        this.selectController = new SelectionController(
            this.canvasController,
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
        return this.canvasController.convertCoordinates(coords);
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
            this.canvasController
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
    public removeLink = (sourceId: string, destinationId: string) => {
        // this._links = this._links.filter(
        //     x =>
        //         x.sourceData.id !== sourceId &&
        //         x.destinationData.id !== destinationId
        // );
    };

    @action
    public clearLinks = () => {
        this._links.forEach(l => l.dispose());
        this._links.clear();
    };

    @action
    public load(data: TNodeData[]) {
        this.clearNodes();
        for (const node of data) {
            this._nodes.set(
                node.id,
                new NodeController(
                    node,
                    this.canvasController,
                    this.handlePortEvent,
                    this.onNodeMove
                )
            );
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
        this.onPortEvent(event, element, data, node);
    };

    private handleMouseDown = (event: MouseEvent) => {
        if (event.ctrlKey) {
            this.canvasController.disableDrag();
            this.selectController.startSelect(this.canvasController.mousePos);
        }
    };

    private handleMouseUp = (event: MouseEvent) => {
        if (this.selectController.selecting) {
            this.selectController.stopSelect(this.canvasController.mousePos);
        }
    };

    @action
    public resetView() {
        this.canvasController.reset();
    }

    @action
    public clearNodes() {
        this._nodes.forEach(n => n.dispose());
        this._nodes.clear();
    }

    public dispose(): void {
        this.clearNodes();
        this.clearLinks();
        this.canvasController.dispose();
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
