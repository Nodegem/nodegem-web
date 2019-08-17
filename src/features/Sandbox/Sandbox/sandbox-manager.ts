import { computed } from 'mobx';
import DrawLinkController from '../Link/draw-link-controller';
import NodeController from '../Node/node-controller';
import CanvasController, { ZoomBounds } from './Canvas/canvas-controller';
import SelectionController from './Canvas/selection-controller';

class SandboxManager<TNodeData = any> implements IDisposable {
    @computed
    public get nodes(): NodeController<TNodeData>[] {
        return this._nodes;
    }

    @computed
    public get isDrawingLink(): boolean {
        return this.drawLinkController.isDrawing;
    }

    private selectController: SelectionController;
    private canvasController: CanvasController;
    private _nodes: NodeController<TNodeData>[];

    private drawLinkController: DrawLinkController;

    constructor(
        private canvasElement: HTMLDivElement,
        bounds: Dimensions,
        zoomBounds?: ZoomBounds
    ) {
        this._nodes = [];
        this.canvasController = new CanvasController(
            canvasElement,
            bounds,
            zoomBounds
        );
        this.selectController = new SelectionController(
            this.canvasController,
            this.onSelection
        );

        this.drawLinkController = new DrawLinkController(this.canvasController);

        canvasElement.parentElement!.addEventListener(
            'mousedown',
            this.handleMouseDown
        );
        canvasElement.parentElement!.addEventListener(
            'mouseup',
            this.handleMouseUp
        );
        window.addEventListener('keypress', this.handleKeyPress);
    }

    public load(data: TNodeData[]) {
        this._nodes = data.map(
            x => new NodeController(x, this.canvasController)
        );
    }

    public clearView() {
        for (const node of this._nodes) {
            node.dispose();
        }

        this._nodes = [];
    }

    public onSelection = (bounds: Bounds) => {
        console.log(bounds);
    };

    private handleMouseDown = (event: MouseEvent) => {
        if (event.ctrlKey) {
            this.canvasController.disableDrag();
            this.selectController.startSelect(this.canvasController.mousePos);
        }
    };

    private handleMouseUp = (event: MouseEvent) => {
        this.selectController.stopSelect(this.canvasController.mousePos);
        this.canvasController.enableDrag();
    };

    private handleKeyPress = (event: KeyboardEvent) => {
        if (event.keyCode === 32) {
            this.resetView();
        }
    };

    public resetView() {
        this.canvasController.reset();
    }

    public dispose(): void {
        this.canvasController.dispose();
        this.canvasElement.parentElement!.removeEventListener(
            'mousedown',
            this.handleMouseDown
        );
        this.canvasElement.parentElement!.removeEventListener(
            'mouseup',
            this.handleMouseUp
        );
        window.removeEventListener('keypress', this.handleKeyPress);
    }
}

export default SandboxManager;
