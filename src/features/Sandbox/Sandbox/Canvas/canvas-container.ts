import Between from 'between.js';
import { clamp } from 'utils';
import Drag from './drag';
import Zoom, { ZoomType } from './zoom';

export type CanvasDimensions = {
    width: number;
    height: number;
};
export type ZoomBounds = {
    min: number;
    max: number;
};

const defaultTween = (oldTransform: Transform, newTransform: Transform) => {
    return new Between(oldTransform, newTransform)
        .time(500)
        .easing(Between.Easing.Cubic.InOut);
};

const defaultZoomTween = (oldTransform: Transform, newTransform: Transform) => {
    return new Between(oldTransform, newTransform)
        .time(350)
        .easing(Between.Easing.Cubic.InOut);
};

export type TweenFunc = (
    oldTransform: Transform,
    newTransform: Transform
) => any;

class CanvasContainer {
    private _mousePos: Vector2;
    public get mousePos(): Vector2 {
        return this._mousePos;
    }

    private anchor: Vector2;
    private parentElement: HTMLElement;
    private backgroundElement: HTMLDivElement;
    private transform: Transform;

    private drag: Drag;
    private zoom: Zoom;
    private transformOrigin: Vector2;
    private bounds: { left: number; top: number } & CanvasDimensions;

    constructor(
        private canvas: HTMLDivElement,
        dimensions: CanvasDimensions,
        private zoomBounds: ZoomBounds = { min: 0.4, max: 2.5 }
    ) {
        this._mousePos = { x: 0, y: 0 };

        this.transformOrigin = {
            x: 0,
            y: 0,
        };

        this.canvas.style.transformOrigin = `${this.transformOrigin.x} ${
            this.transformOrigin.y
        }`;

        this.transform = {
            x: 0,
            y: 0,
            scale: 1,
        };
        this.anchor = this.transform;

        this.bounds = {
            left: -dimensions.width / 2,
            top: -dimensions.height / 2,
            width: dimensions.width / 2,
            height: dimensions.height / 2,
        };

        this.backgroundElement = document.createElement('div');
        this.backgroundElement.classList.add('view-background');
        this.backgroundElement.style.left = `${this.bounds.left}px`;
        this.backgroundElement.style.top = `${this.bounds.top}px`;
        this.backgroundElement.style.width = `${this.bounds.width * 2}px`;
        this.backgroundElement.style.height = `${this.bounds.height * 2}px`;
        this.canvas.prepend(this.backgroundElement);

        this.parentElement = this.canvas.parentElement!;
        this.parentElement.addEventListener('mousedown', this.onMouseDown);
        this.parentElement.addEventListener('mousemove', this.onMouseMove);
        this.parentElement.addEventListener('resize', () =>
            this.translate(this.transform)
        );

        this.drag = new Drag(this.parentElement, this.onTranslate);
        this.zoom = new Zoom(this.parentElement, this.canvas, 0.1, this.onZoom);

        this.update();
    }

    private onMouseDown = (e: MouseEvent) => {
        this.anchor = this.transform;
    };

    private onMouseMove = (e: MouseEvent) => {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const k = this.transform.scale;

        this._mousePos = { x: x / k, y: y / k };
    };

    public update() {
        const oX = this.transformOrigin.x;
        const oY = this.transformOrigin.y;
        const { x, y, scale } = this.transform;
        this.canvas.style.transform = `translate(${oX + x}px, ${oY +
            y}px) scale(${scale})`;
    }

    private onTranslate = (delta: Vector2, e: MouseEvent) => {
        const { x, y } = this.anchor;
        const { scale } = this.transform;
        this.translate({
            x: x + delta.x,
            y: y + delta.y,
            scale,
        });
    };

    public translate(position: Transform, tweenFunc?: TweenFunc) {
        const { x, y, scale } = position;
        const { width, height } = this.parentElement.getBoundingClientRect();
        const oldTransform = this.transform;

        const minBounds = {
            x: this.bounds.left * scale + width,
            y: this.bounds.top * scale + height,
        };
        const maxBounds = {
            x: -this.bounds.left * scale,
            y: -this.bounds.top * scale,
        };

        const clampedX = clamp(x, minBounds.x, maxBounds.x);
        const clampedY = clamp(y, minBounds.y, maxBounds.y);

        const newTransform = {
            x: clampedX,
            y: clampedY,
            scale,
        };

        if (!tweenFunc) {
            this.transform = newTransform;
            this.update();
        } else {
            tweenFunc(oldTransform, newTransform).on(
                'update',
                (value: Transform) => {
                    this.transform = value;
                    this.update();
                }
            );
        }
    }

    public reset() {
        this.translate(
            {
                x: 0,
                y: 0,
                scale: 1,
            },
            defaultTween
        );
    }

    private onZoom = (delta: number, position: Vector2, type: ZoomType) => {
        this.performZoom(this.transform.scale * (1 + delta), position, type);
    };

    private performZoom = (
        zoomDelta: number,
        position: Vector2 = { x: 0, y: 0 },
        type: ZoomType
    ) => {
        const { scale } = this.transform;
        const { min, max } = this.zoomBounds;
        const clampedZoom = clamp(zoomDelta, min, max);

        const d = (scale - clampedZoom) / (scale - zoomDelta || 1);

        const { x, y } = this.transform;

        const newTransform = {
            x: x + position.x * d,
            y: y + position.y * d,
            scale: clampedZoom || 1,
        };
        if (type !== 'dblClick') {
            this.translate(newTransform);
        } else {
            this.translate(newTransform, defaultZoomTween);
        }
    };
}

export default CanvasContainer;
