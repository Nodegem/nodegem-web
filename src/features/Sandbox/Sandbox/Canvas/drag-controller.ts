import { isInput, isTouchEvent } from 'utils';

export type DragStartEvent = (e: MouseEvent) => void;
export type DragTranslateEvent = (delta: Vector2, e: MouseEvent) => void;
export type DragUpEvent = (e: MouseEvent) => void;

class DragController implements IDisposable {
    private mouseStart: Vector2 | null;

    constructor(
        private container: HTMLElement,
        private onTranslate: DragTranslateEvent = () => {},
        private onDragUp: DragUpEvent = () => {},
        private onCanvasDown: DragStartEvent = () => {}
    ) {
        this.mouseStart = null;
        this.initEvents();
    }

    private initEvents() {
        this.container.addEventListener('mousedown', this.handleDown);
        window.addEventListener('mousemove', this.handleMove);
        window.addEventListener('mouseup', this.handleUp);

        this.container.addEventListener('touchstart', this.handleDown);
        window.addEventListener('touchmove', this.handleMove, {
            passive: false,
        });
        window.addEventListener('touchend', this.handleUp);
    }

    private getCoords(event: MouseEvent | TouchEvent): Vector2 {
        const props = isTouchEvent(event) ? event.touches[0] : event;
        return { x: props.pageX, y: props.pageY };
    }

    private handleDown = (event: MouseEvent | TouchEvent) => {
        if (
            (event instanceof MouseEvent && event.which === 3) ||
            isInput(event.target as Element)
        ) {
            return;
        }

        // event.stopPropagation();
        this.onCanvasDown(event as MouseEvent);
        this.mouseStart = this.getCoords(event);
    };

    private handleMove = (event: MouseEvent | TouchEvent) => {
        if (!this.mouseStart) {
            return;
        }
        event.preventDefault();
        // event.stopPropagation();

        const { x, y } = this.getCoords(event);
        const delta = { x: x - this.mouseStart.x, y: y - this.mouseStart.y };
        const zoom =
            this.container.getBoundingClientRect().width /
            this.container.offsetWidth;

        this.onTranslate(
            { x: delta.x / zoom, y: delta.y / zoom },
            event as MouseEvent
        );
    };

    private handleUp = (event: MouseEvent | TouchEvent) => {
        if (!this.mouseStart) {
            return;
        }

        this.mouseStart = null;
        this.onDragUp(event as MouseEvent);
    };

    public dispose(): void {
        this.container.removeEventListener('mousedown', this.handleDown);
        window.removeEventListener('mousemove', this.handleMove);
        window.removeEventListener('mouseup', this.handleUp);

        this.container.removeEventListener('touchstart', this.handleDown);
        window.removeEventListener('touchmove', this.handleMove);
        window.removeEventListener('touchend', this.handleUp);
    }
}

export default DragController;
