import { action, computed, observable } from 'mobx';
import NodeController from '../Node/node-controller';
import CanvasController, { ZoomBounds } from './Canvas/canvas-controller';
import SelectionController from './Canvas/selection-controller';

class SandboxManager<TNodeData extends INodeData = any> implements IDisposable {
    @computed
    public get nodes(): NodeController<TNodeData>[] {
        return this._nodes;
    }

    @observable
    private _nodes: NodeController<TNodeData>[] = [];

    private _hasBeenInitialized = false;
    public get hasBeenInitialized() {
        return this._hasBeenInitialized;
    }

    private canvasElement: HTMLDivElement;
    private selectController: SelectionController;
    private canvasController: CanvasController;
    private bounds: Dimensions;
    private zoomBounds?: ZoomBounds;

    constructor(
        private onSelection: (bounds: Bounds) => void,
        private onPortDown: (element: HTMLElement, data: IPortData) => void
    ) {}

    public setProperties(
        element: HTMLDivElement,
        bounds: Dimensions,
        zoomBounds?: ZoomBounds
    ) {
        if (this.hasBeenInitialized) {
            return;
        }

        this.canvasElement = element;
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
        window.addEventListener('keypress', this.handleKeyPress);
        this._hasBeenInitialized = true;
    }

    @action
    public load(data: TNodeData[]) {
        this.disposeNodes();
        this._nodes = data.map(
            x =>
                new NodeController(
                    x,
                    this.canvasController,
                    this.handlePortDown
                )
        );
    }

    @action
    public clearView() {
        this.disposeNodes();
        this._nodes = [];
    }

    private handleSelection = (bounds: Bounds) => {
        this.onSelection(bounds);
    };

    private handlePortDown = (element: HTMLElement, data: IPortData) => {
        this.onPortDown(element, data);
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

    private handleKeyPress = (event: KeyboardEvent) => {
        if (event.keyCode === 32) {
            this.resetView();
        }
    };

    public resetView() {
        this.canvasController.reset();
    }

    private disposeNodes() {
        for (const node of this._nodes) {
            node.dispose();
        }
    }

    public dispose(): void {
        this.disposeNodes();
        this.canvasController.dispose();
        this.selectController.dispose();
        this.canvasElement.parentElement!.removeEventListener(
            'mousedown',
            this.handleMouseDown
        );
        this.canvasElement.parentElement!.removeEventListener(
            'mouseup',
            this.handleMouseUp
        );
        window.removeEventListener('keypress', this.handleKeyPress);
        this._hasBeenInitialized = false;
    }
}

export default SandboxManager;
