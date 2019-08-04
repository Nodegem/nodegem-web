import { isMouseEvent, isTouchEvent } from 'utils';

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

    private anchor: Vector2;
    private _domElement: HTMLElement;
    constructor(element: HTMLElement) {
        element.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);

        this._domElement = element;
        this.update();
    }

    private update() {
        const { x, y } = this._position;
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

        if (!this.disabled) {
            return;
        }

        console.log(event);

        event.preventDefault();
        event.stopPropagation();
        this._isDragging = true;
        this.anchor = this.getCoords(event);
    };

    private handleMouseMove = (event: MouseEvent | TouchEvent) => {
        if (!this.isDragging) {
            return;
        }
        event.preventDefault();

        this.anchor = this.getCoords(event);
    };

    private handleMouseUp = (event: MouseEvent | TouchEvent) => {
        if (!this.isDragging) {
            return;
        }

        event.preventDefault();
    };

    public dispose(): void {
        this._domElement.removeEventListener('mousedown', this.handleMouseDown);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
    }
}

export default Moveable;
