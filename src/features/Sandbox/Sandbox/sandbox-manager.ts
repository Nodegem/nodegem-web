import NodeController from '../Node/node-controller';
import CanvasController, { ZoomBounds } from './Canvas/canvas-controller';

class SandboxManager<TNodeData = any> implements IDisposable {
    public get nodes(): NodeController<TNodeData>[] {
        return this._nodes;
    }

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

    public resetView() {
        this.canvasController.reset();
    }

    public dispose(): void {
        this.canvasController.dispose();
    }
}

export default SandboxManager;
