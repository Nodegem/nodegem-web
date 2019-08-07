import Between from 'between.js';
import { ResizeSensor } from 'css-element-queries';
import { clamp } from 'utils';
import Drag from './drag';
import Zoom, { ZoomType } from './zoom';

interface ICanvasBounds extends Dimensions {
    left: number;
    top: number;
}

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

    public get elementDimensions(): Dimensions {
        return this.parentElement.getBoundingClientRect();
    }

    private get bounds(): ICanvasBounds {
        return {
            left: -this.dimensions.width / 2,
            top: -this.dimensions.height / 2,
            width: this.dimensions.width / 2,
            height: this.dimensions.height / 2,
        };
    }

    private anchor: Vector2;
    private parentElement: HTMLElement;
    private backgroundElement: HTMLDivElement;
    private transform: Transform;

    private drag: Drag;
    private zoom: Zoom;
    private transformOrigin: Vector2;

    private get offset(): Vector2 {
        const { width, height } = this.elementDimensions;
        const { x, y } = this.transformOrigin;
        return {
            x: width * x,
            y: height * y,
        };
    }

    private sensor: ResizeSensor;

    constructor(
        private canvas: HTMLDivElement,
        private dimensions: Dimensions,
        private zoomBounds: ZoomBounds = { min: 0.4, max: 2.5 }
    ) {
        this._mousePos = { x: 0, y: 0 };

        this.transformOrigin = {
            x: 0.5,
            y: 0.5,
        };

        this.canvas.style.transformOrigin = `0 0`;

        this.transform = {
            x: 0,
            y: 0,
            scale: 1,
        };
        this.anchor = this.transform;

        this.parentElement = this.canvas.parentElement!;
        this.parentElement.addEventListener('mousedown', this.onMouseDown);
        this.parentElement.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('resize', ev => this.resize(ev));

        this.backgroundElement = document.createElement('div');
        this.backgroundElement.classList.add('view-background');
        this.canvas.prepend(this.backgroundElement);

        this.drag = new Drag(this.parentElement, this.onTranslate);
        this.zoom = new Zoom(this.parentElement, this.canvas, 0.1, this.onZoom);
        this.sensor = new ResizeSensor(this.parentElement, () => this.resize());

        this.resize();
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
        const { x, y, scale } = this.transform;
        const offset = this.offset;
        const newTransform = {
            x: -offset.x + x,
            y: offset.y + y,
        };
        this.canvas.style.transform = `translate(${newTransform.x}px, ${
            newTransform.y
        }px) scale(${scale})`;
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
        const oldTransform = this.transform;
        const { left, top } = this.bounds;

        const minBounds = {
            x: left * scale,
            y: top * scale,
        };
        const maxBounds = {
            x: -left * scale,
            y: -top * scale,
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

    private resize = (event?: UIEvent) => {
        const { x, y } = this.offset;

        this.backgroundElement.style.left = `${this.bounds.left - x}px`;
        this.backgroundElement.style.top = `${this.bounds.top - y}px`;
        this.backgroundElement.style.width = `${this.bounds.width * 2 +
            x * 2}px`;
        this.backgroundElement.style.height = `${this.bounds.height * 2 +
            y * 2}px`;
        this.translate(this.transform, event && defaultTween);
    };

    public dispose(): void {
        this.parentElement.removeEventListener('mousedown', this.onMouseDown);
        this.parentElement.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('resize', this.resize);

        this.drag.dispose();
        this.zoom.dispose();
        this.sensor.detach();
    }
}

export default CanvasContainer;
