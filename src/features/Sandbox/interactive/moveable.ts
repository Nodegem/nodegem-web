import { ResizeSensor } from 'css-element-queries';
import { clamp, isMouseEvent, isTouchEvent } from 'utils';
import CanvasController from '../Sandbox/Canvas/canvas-controller';

class Moveable implements IDisposable {
    private _transformOrigin: Vector2;
    public get transformOrigin(): Vector2 {
        return this._transformOrigin;
    }

    public set transformOrigin(value: Vector2) {
        this._transformOrigin = {
            x: clamp(value.x, 0, 1),
            y: clamp(value.y, 0, 1),
        };
    }

    private _position: Vector2 = { x: 0, y: 0 };
    public get position() {
        return this._position;
    }
    public set position(value: Vector2) {
        this._position = value;
    }

    private _isDragging = false;
    public get isDragging() {
        return this._isDragging;
    }

    public disabled = false;

    private get elementDimensions(): Dimensions {
        return this.element.getBoundingClientRect();
    }

    private get offset(): Vector2 {
        const { width, height } = this.elementDimensions;
        const { x, y } = this.transformOrigin;
        return { x: x * width, y: y * height };
    }

    private posStart: Vector2;
    private anchor: Vector2;
    private sensor: ResizeSensor;
    constructor(
        private element: HTMLElement,
        private canvasContainer: CanvasController,
        transformOrigin: Vector2 = { x: 0.5, y: 0.5 }
    ) {
        element.addEventListener('mousedown', this.handleMouseDown);
        element.addEventListener('dblclick', e => e.stopPropagation());
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);

        this.sensor = new ResizeSensor(element, () => this.update());

        this.transformOrigin = transformOrigin;
        this.update();
    }

    private update() {
        const { x, y } = this.position;
        const offset = this.offset;
        const { scale } = this.canvasContainer;
        this.element.style.transform = `translate(${x -
            offset.x / scale}px, ${y - offset.y / scale}px)`;
    }

    private getCoords(event: MouseEvent | TouchEvent): Vector2 {
        const props = isTouchEvent(event) ? event.touches[0] : event;
        return { x: props.pageX, y: props.pageY };
    }

    private handleMouseDown = (event: MouseEvent | TouchEvent) => {
        if (isMouseEvent(event)) {
            if (event.which === 2 || event.which === 3) {
                return;
            }
        }

        if (this.disabled) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        console.log('test');
        this._isDragging = true;
        this.anchor = this.getCoords(event);
        this.posStart = this.position;
    };

    private handleMouseMove = (event: MouseEvent | TouchEvent) => {
        if (!this.isDragging) {
            return;
        }
        event.preventDefault();

        const coords = this.getCoords(event);
        const delta = {
            x: coords.x - this.anchor.x,
            y: coords.y - this.anchor.y,
        };

        const { scale } = this.canvasContainer;
        this.translate({
            x: delta.x / scale,
            y: delta.y / scale,
        });
    };

    public translate(delta: Vector2) {
        const { x, y } = this.posStart;
        this._position = {
            x: x + delta.x,
            y: y + delta.y,
        };
        this.update();
    }

    private handleMouseUp = (event: MouseEvent | TouchEvent) => {
        if (!this.isDragging) {
            return;
        }

        event.preventDefault();
        this._isDragging = false;
    };

    public dispose(): void {
        this.element.removeEventListener('mousedown', this.handleMouseDown);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
        this.sensor.detach();
    }
}

export default Moveable;
