import Drag from './drag';
import Zoom from './zoom';

class CanvasContainer {
    private canvas: HTMLDivElement;
    private drag: Drag;
    private zoom: Zoom;

    constructor(canvas: HTMLDivElement) {
        this.canvas = canvas;
        // this.drag = new Drag(canvas);
        // this.zoom = new Zoom(canvas);
    }
}

export default CanvasContainer;
