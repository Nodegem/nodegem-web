import CanvasContainer, {
    CanvasDimensions,
    ZoomBounds,
} from './Canvas/canvas-container';

class SandboxManager {
    private canvasContainer: CanvasContainer;

    constructor(
        private canvasElement: HTMLDivElement,
        bounds: CanvasDimensions,
        zoomBounds?: ZoomBounds
    ) {
        this.canvasContainer = new CanvasContainer(
            canvasElement,
            bounds,
            zoomBounds
        );
    }

    public resetView() {
        this.canvasContainer.reset();
    }
}

export default SandboxManager;
