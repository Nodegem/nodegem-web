import Between from 'between.js';
import { ResizeSensor } from 'css-element-queries';
import { clamp } from 'utils';
import DragController from './drag-controller';
import ZoomController, { ZoomType } from './zoom-controller';

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

class CanvasController implements IDisposable {
    private _mousePos: Vector2;
    public get mousePos(): Vector2 {
        return this._mousePos;
    }

    private disableDragging = false;
    public get isDraggingDisabled(): boolean {
        return this.disableDragging;
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

    private get bounds(): Bounds {
        return {
            left: -this.dimensions.width * 0.5,
            top: -this.dimensions.height * 0.5,
            width: this.dimensions.width * 0.5,
            height: this.dimensions.height * 0.5,
        };
    }

    private anchor: Vector2;
    private parentElement: HTMLElement;
    private backgroundElement: HTMLDivElement;
    private transform: Transform;

    private drag: DragController;
    private zoom: ZoomController;
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
        public canvas: HTMLDivElement,
        private dimensions: Dimensions,
        private zoomBounds: ZoomBounds = { min: 0.53, max: 2.75 },
        private onCanvasDown: (event: MouseEvent) => void
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

        this.drag = new DragController(
            this.parentElement,
            this.onTranslate,
            () => {},
            this.onCanvasDown
        );
        this.zoom = new ZoomController(
            this.parentElement,
            this.canvas,
            0.1,
            this.onZoom
        );
        this.sensor = new ResizeSensor(this.parentElement, () => this.resize());

        this.resize();
        this.update();
    }

    private onMouseDown = (e: MouseEvent) => {
        this.anchor = this.transform;
    };

    private onMouseMove = (e: MouseEvent) => {
        this._mousePos = this.convertCoordinates({
            x: e.clientX,
            y: e.clientY,
        });
    };

    public convertCoordinates = (coords: Vector2) => {
        const rect = this.canvas.getBoundingClientRect();
        const x = coords.x - rect.left;
        const y = coords.y - rect.top;
        const k = this.transform.scale;
        return { x: x / k, y: y / k };
    };

    public update() {
        const { x, y, scale } = this.transform;
        const offset = this.offset;
        const newTransform = {
            x: -offset.x + x,
            y: offset.y + y,
        };
        this.canvas.style.transform = `translate(${newTransform.x}px, ${newTransform.y}px) scale(${scale})`;
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
        if (this.isDraggingDisabled) {
            return;
        }

        const { x, y, scale } = position;
        const oldTransform = this.transform;
        const { left, top } = this.bounds;
        const { width, height } = this.elementDimensions;
        const { halfWidth, halfHeight } = {
            halfWidth: width * 0.5,
            halfHeight: height * 0.5,
        };

        const minBounds = {
            x: left * scale + halfWidth,
            y: top * scale + halfHeight,
        };
        const maxBounds = {
            x: -left * scale - halfWidth,
            y: -top * scale - halfHeight,
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

    public disableDrag() {
        this.disableDragging = true;
    }

    public enableDrag() {
        this.disableDragging = false;
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

    public magnify(zoomDelta: number) {
        const { scale } = this.transform;
        this.translate(
            { ...this.transform, scale: scale + zoomDelta },
            defaultZoomTween
        );
    }

    private onZoom = (delta: number, type: ZoomType, position: Vector2) => {
        console.log(position);
        this.performZoom(this.transform.scale * (1 + delta), type, position);
    };

    private performZoom = (
        zoomDelta: number,
        type: ZoomType,
        position: Vector2 = { x: 0, y: 0 }
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
        this.backgroundElement.remove();
        this.parentElement.removeEventListener('mousedown', this.onMouseDown);
        this.parentElement.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('resize', this.resize);

        this.drag.dispose();
        this.zoom.dispose();
        this.sensor.detach();
    }
}

export default CanvasController;
