import { isTouchEvent } from 'utils';

export type DragStartEvent = (e: MouseEvent) => void;
export type DragTranslateEvent = (delta: Vector2, e: MouseEvent) => void;
export type DragUpEvent = (e: MouseEvent) => void;

class Drag {
    private mouseStart: Vector2 | null;

    constructor(
        private container: HTMLElement,
        public onTranslate: DragTranslateEvent = () => {},
        public onDragUp: DragUpEvent = () => {}
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
        if (event instanceof MouseEvent && event.which === 3) {
            return;
        }

        event.stopPropagation();
        this.mouseStart = this.getCoords(event);
    };

    private handleMove = (event: MouseEvent | TouchEvent) => {
        if (!this.mouseStart) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();

        const { x, y } = this.getCoords(event);
        const delta = { dX: x - this.mouseStart.x, dY: y - this.mouseStart.y };
        const zoom =
            this.container.getBoundingClientRect().width /
            this.container.offsetWidth;

        this.onTranslate(
            { x: delta.dX / zoom, y: delta.dY / zoom },
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
}

export default Drag;
