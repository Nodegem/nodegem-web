import Between from 'between.js';
import { clamp } from 'utils';
import Drag, { Vector2 } from './drag';
import Zoom from './zoom';

export type CanvasBounds = {
    left: number;
    top: number;
    width: number;
    height: number;
};
export type ZoomBounds = {
    min: number;
    max: number;
};

export type Transform = { x: number; y: number; scale: number };

class CanvasContainer {
    private _mousePos: Vector2;
    public get mousePos(): Vector2 {
        return this._mousePos;
    }

    private parentElement: HTMLElement;
    private backgroundElement: HTMLDivElement;
    private transform: Transform;
    private startPosition: Vector2;

    private drag: Drag;
    private zoom: Zoom;

    constructor(
        private canvas: HTMLDivElement,
        private bounds: CanvasBounds,
        private zoomBounds: ZoomBounds = { min: 0.4, max: 2.5 }
    ) {
        this._mousePos = { x: 0, y: 0 };
        this.canvas.style.transformOrigin = '0 0';
        this.transform = {
            x: bounds.width / 2,
            y: bounds.height / 2,
            scale: 1,
        };

        this.backgroundElement = document.createElement('div');
        this.backgroundElement.classList.add('view-background');
        this.backgroundElement.style.left = `${bounds.left}px`;
        this.backgroundElement.style.top = `${bounds.top}px`;
        this.backgroundElement.style.width = `${bounds.width}px`;
        this.backgroundElement.style.height = `${bounds.height}px`;
        this.canvas.prepend(this.backgroundElement);

        this.parentElement = this.canvas.parentElement!;
        this.parentElement.addEventListener('mousemove', this.onMouseMove);
        this.parentElement.addEventListener('resize', () =>
            this.translate(this.transform)
        );

        this.drag = new Drag(
            this.parentElement,
            this.onTranslate,
            this.onStart
        );

        this.zoom = new Zoom(this.parentElement, this.canvas, 0.1, this.onZoom);

        this.update();
    }

    private onMouseMove = (e: MouseEvent) => {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const k = this.transform.scale;

        this._mousePos = { x: x / k, y: y / k };
    };

    public update() {
        const { x, y, scale } = this.transform;
        this.canvas.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }

    private onStart = (e: MouseEvent) => {
        this.startPosition = {
            x: this.transform.x,
            y: this.transform.y,
        };
    };

    private onTranslate = (delta: Vector2, e: MouseEvent) => {
        const { x, y } = this.startPosition;
        this.translate({
            x: x + delta.x,
            y: y + delta.y,
            scale: this.transform.scale,
        });
    };

    public translate(position: Transform, animate: boolean = false) {
        const { x, y, scale } = position;
        const { width, height } = this.parentElement.getBoundingClientRect();
        const oldTransform = this.transform;
        const newTransform = {
            x: clamp(x, 0 + width, this.bounds.width - width),
            y: clamp(y, 0 + height, this.bounds.height - height),
            scale,
        };

        if (!animate) {
            this.transform = newTransform;
            this.update();
        } else {
            new Between(oldTransform, newTransform)
                .time(250)
                .easing(Between.Easing.Cubic.InOut)
                .on('update', value => {
                    this.transform = value;
                    this.update();
                });
        }
    }

    public reset() {
        this.translate(
            {
                x: this.bounds.width / 2,
                y: this.bounds.height / 2,
                scale: 1,
            },
            true
        );
    }

    private onZoom = (delta: number, position: Vector2) => {
        this.performZoom(this.transform.scale * (1 + delta), position);
    };

    private performZoom = (
        zoomDelta: number,
        position: Vector2 = { x: 0, y: 0 }
    ) => {
        const { scale } = this.transform;
        const { min, max } = this.zoomBounds;
        const clampedZoom = clamp(zoomDelta, min, max);

        const d = (scale - clampedZoom) / (scale - zoomDelta || 1);

        this.transform.scale = clampedZoom || 1;
        this.transform.x += position.x * d;
        this.transform.y += position.y * d;

        this.update();
    };
}

export default CanvasContainer;
