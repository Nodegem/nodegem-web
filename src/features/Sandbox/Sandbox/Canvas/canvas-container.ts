import { clamp } from 'utils';
import Drag, { Vector2 } from './drag';
import Zoom from './zoom';

export type CanvasBounds = {
    left: number;
    top: number;
    width: number;
    height: number;
};
export type Transform = { x: number; y: number; zoom: number };

class CanvasContainer {
    private transform: Transform;
    private mouse: Vector2;
    private startPosition: Vector2;

    private drag: Drag;
    private zoom: Zoom;

    constructor(private canvas: HTMLDivElement, private bounds: CanvasBounds) {
        this.transform = { x: 0, y: 0, zoom: 1 };
        this.mouse = { x: 0, y: 0 };
        this.startPosition = {
            x: this.transform.x,
            y: this.transform.y,
        };

        canvas.style.transformOrigin = '0 0';

        this.drag = new Drag(canvas, this.onTranslate, this.onStart);
        this.zoom = new Zoom(canvas, 0.1, this.onZoom);
    }

    public update() {
        const { x, y, zoom } = this.transform;
        this.canvas.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
    }

    private onStart = (e: MouseEvent) => {
        this.startPosition = {
            x: this.transform.x,
            y: this.transform.y,
        };
    };

    private onTranslate = (delta: Vector2, e: MouseEvent) => {
        const { x, y } = this.startPosition;
        const { left, top, width, height } = this.bounds;
        const { halfWidth, halfHeight } = {
            halfWidth: width / 2,
            halfHeight: height / 2,
        };
        const { innerWidth, innerHeight } = window;
        const translate = {
            x: clamp(
                x + delta.x,
                left + innerWidth,
                width - halfWidth - innerWidth
            ),
            y: clamp(
                y + delta.y,
                top + innerHeight,
                height - halfHeight - innerHeight
            ),
        };
        this.translate(translate);
    };

    public translate(position: Vector2) {
        const { x, y } = position;

        this.transform.x = x;
        this.transform.y = y;

        this.update();
    }

    private onZoom = (delta: number, position: Vector2) => {
        this.performZoom(this.transform.zoom * (1 + delta), position);
        this.update();
    };

    private performZoom = (zoomDelta: number, position: Vector2) => {
        const { zoom } = this.transform;
        const params = {
            transform: this.transform,
            zoom: clamp(zoomDelta, 0.4, 2.5),
        };

        const d = (zoom - params.zoom) / (zoom - zoomDelta || 1);

        this.transform.zoom = params.zoom || 1;
        this.transform.x += position.x * d;
        this.transform.y += position.y * d;

        this.update();
    };
}

export default CanvasContainer;
