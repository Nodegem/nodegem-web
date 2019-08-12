import NodeController from '../Node/node-controller';
import CanvasController, { ZoomBounds } from './Canvas/canvas-controller';
import SelectController from './Canvas/select-controller';

class SandboxManager<TNodeData = any> implements IDisposable {
    public get nodes(): NodeController<TNodeData>[] {
        return this._nodes;
    }

    private selectController: SelectController;
    private canvasController: CanvasController;
    private _nodes: NodeController<TNodeData>[];

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
        this.selectController = new SelectController(
            this.canvasController,
            this.onSelected
        );

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

    public onSelected = (bounds: Bounds) => {
        console.log(bounds);
    };

    private handleMouseDown = (event: MouseEvent) => {
        if (event.ctrlKey) {
            this.canvasController.disableDrag();
            this.selectController.startSelect(this.canvasController.mousePos);
        }
    };

    private handleMouseUp = (event: MouseEvent) => {
        this.selectController.stopSelect(
            this.canvasController.mousePos
        );
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
    }
}

export default SandboxManager;
