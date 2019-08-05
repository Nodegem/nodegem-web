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

class CanvasContainer implements IDisposable {
    private _mousePos: Vector2;
    public get mousePos(): Vector2 {
        return this._mousePos;
    }

    public get scale(): number {
        return this.transform.scale;
    }

    public get position(): Vector2 {
        return this.transform;
    }

    public get elementDimensions(): CanvasDimensions {
        return this.parentElement.getBoundingClientRect();
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
        private dimensions: CanvasDimensions,
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

        this.parentElement = this.canvas.parentElement!;
        this.parentElement.addEventListener('mousedown', this.onMouseDown);
        this.parentElement.addEventListener('mousemove', this.onMouseMove);
        this.parentElement.addEventListener('resize', this.resize);

        this.backgroundElement = document.createElement('div');
        this.backgroundElement.classList.add('view-background');
        this.resize();
        this.canvas.prepend(this.backgroundElement);

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
        const { width, height } = this.elementDimensions;
        const oldTransform = this.transform;

        const minBounds = {
            x: this.bounds.left * scale,
            y: this.bounds.top * scale,
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

    private resize() {
        const { width, height } = this.elementDimensions;

        this.bounds = {
            left: -this.dimensions.width / 2,
            top: -this.dimensions.height / 2,
            width: this.dimensions.width / 2,
            height: this.dimensions.height / 2,
        };

        this.backgroundElement.style.left = `${this.bounds.left - width}px`;
        this.backgroundElement.style.top = `${this.bounds.top - height}px`;
        this.backgroundElement.style.width = `${width +
            this.bounds.width * 2}px`;
        this.backgroundElement.style.height = `${height +
            this.bounds.height * 2}px`;
        this.translate(this.transform);
    }

    public dispose(): void {
        this.parentElement.removeEventListener('mousedown', this.onMouseDown);
        this.parentElement.removeEventListener('mousemove', this.onMouseMove);
        this.parentElement.removeEventListener('resize', this.resize);

        this.drag.dispose();
        this.zoom.dispose();
    }
}

export default CanvasContainer;
