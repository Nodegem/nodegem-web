import CanvasController from '../Sandbox/Canvas/canvas-controller';

class DrawLinkController {
    public get isDrawing() {
        return !!this.source;
    }

    private source: HTMLElement | null;

    constructor(private canvasController: CanvasController) {}

    public beginDraw(source: HTMLElement) {
        this.source = source;
    }
}

export default DrawLinkController;
