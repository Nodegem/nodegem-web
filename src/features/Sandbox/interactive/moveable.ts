import { isMouseEvent, isTouchEvent } from 'utils';
import CanvasContainer from '../Sandbox/Canvas/canvas-container';

class Moveable implements IDisposable {
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

    private posStart: Vector2;
    private anchor: Vector2;
    private _domElement: HTMLElement;
    constructor(
        element: HTMLElement,
        private canvasContainer: CanvasContainer
    ) {
        element.addEventListener('mousedown', this.handleMouseDown);
        element.addEventListener('dblclick', e => e.stopPropagation());
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);

        this._domElement = element;
        this.update();
    }

    private update() {
        const { x, y } = this.position;
        this._domElement.style.transform = `translate(${x}px, ${y}px)`;
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
        this._domElement.removeEventListener('mousedown', this.handleMouseDown);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
    }
}

export default Moveable;
