import { isInput, isTouchEvent } from 'utils';

export type DragTranslateEvent = (delta: Vector2, e: MouseEvent) => void;

class DragController implements IDisposable {
    private mouseStart: Vector2 | null;

    constructor(
        private container: HTMLElement,
        private viewbox: HTMLElement,
        private onTranslate: DragTranslateEvent = () => {},
        private onCanvasDown: (event: MouseEvent) => void,
        private onCanvasUp: (event: MouseEvent) => void,
        private onCanvasRightClick: (event: MouseEvent) => void
    ) {
        this.mouseStart = null;
        this.initEvents();
    }

    private initEvents() {
        this.container.addEventListener('mousedown', this.handleDown);
        this.container.addEventListener('mouseup', this.handleCanvasUp);
        this.container.addEventListener('contextmenu', this.handleRightClick);
        window.addEventListener('mousemove', this.handleMove);
        window.addEventListener('mouseup', this.handleUp);
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

        const target = event.target as HTMLElement;
        if (!this.isCanvas(target)) {
            return;
        }

        this.onCanvasDown(event as MouseEvent);
        this.mouseStart = this.getCoords(event);
    };

    private handleCanvasUp = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!this.isCanvas(target)) {
            return;
        }

        this.onCanvasUp(event);
    };

    private handleRightClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!this.isCanvas(target)) {
            return;
        }

        this.onCanvasRightClick(event);
    };

    private handleMove = (event: MouseEvent | TouchEvent) => {
        if (!this.mouseStart) {
            return;
        }

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
    };

    public isCanvas = (element: HTMLElement) => {
        return element === this.container || element === this.viewbox;
    };

    public dispose(): void {
        this.container.removeEventListener('mousedown', this.handleDown);
        this.container.removeEventListener('mouseup', this.handleCanvasUp);
        this.container.removeEventListener(
            'contextmenu',
            this.handleRightClick
        );
        window.removeEventListener('mousemove', this.handleMove);
        window.removeEventListener('mouseup', this.handleUp);

        this.container.removeEventListener('touchstart', this.handleDown);
        window.removeEventListener('touchmove', this.handleMove);
        window.removeEventListener('touchend', this.handleUp);
    }
}

export default DragController;
