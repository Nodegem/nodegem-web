import CanvasController from '../Sandbox/Canvas/canvas-controller';

class LinkController {
    private get hasDestination(): boolean {
        return !!this.destination;
    }

    constructor(
        private canvasController: CanvasController,
        private source: HTMLElement,
        private destination: HTMLElement | null
    ) {}
}
