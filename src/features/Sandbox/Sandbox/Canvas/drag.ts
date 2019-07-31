import { isTouchEvent } from 'utils';

export type Vector2 = {
    x: number;
    y: number;
};

export type DragStartEvent = (e: MouseEvent) => void;
export type DragTranslateEvent = (delta: Vector2, e: MouseEvent) => void;
export type DragUpEvent = (e: MouseEvent) => void;

class Drag {
    private mouseStart: Vector2 | null;

    constructor(
        private el: HTMLElement,
        public onTranslate: DragTranslateEvent = () => {},
        public onStart: DragStartEvent = () => {},
        public onDragUp: DragUpEvent = () => {}
    ) {
        this.mouseStart = null;

        this.el = el;
        this.onTranslate = onTranslate;
        this.onStart = onStart;
        this.onDragUp = onDragUp;

        this.initEvents();
    }

    private initEvents() {
        this.el.addEventListener('mousedown', this.handleDown);
        window.addEventListener('mousemove', this.handleMove);
        window.addEventListener('mouseup', this.handleUp);

        this.el.addEventListener('touchstart', this.handleDown);
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
        event.preventDefault();
        this.mouseStart = this.getCoords(event);

        this.onStart(event as MouseEvent);
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
            this.el.getBoundingClientRect().width / this.el.offsetWidth;

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
