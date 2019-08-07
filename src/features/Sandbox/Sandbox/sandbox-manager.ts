import NodeController from '../Node/node-controller';
import CanvasContainer, { ZoomBounds } from './Canvas/canvas-container';

class SandboxManager<TNodeData = any> implements IDisposable {
    public get nodes(): NodeController<TNodeData>[] {
        return this._nodes;
    }

    private canvasContainer: CanvasContainer;
    private _nodes: NodeController<TNodeData>[];

    constructor(
        private canvasElement: HTMLDivElement,
        bounds: Dimensions,
        zoomBounds?: ZoomBounds
    ) {
        this._nodes = [];
        this.canvasContainer = new CanvasContainer(
            canvasElement,
            bounds,
            zoomBounds
        );
    }

    public load(data: TNodeData[]) {
        this._nodes = data.map(
            x => new NodeController(x, this.canvasContainer)
        );
    }

    public clearView() {
        this._nodes = [];
    }

    public resetView() {
        this.canvasContainer.reset();
    }

    public dispose(): void {
        this.canvasContainer.dispose();
    }
}

export default SandboxManager;
