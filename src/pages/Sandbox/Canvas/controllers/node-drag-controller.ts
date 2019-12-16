export class NodeDragController {
    public get isDragging(): boolean {
        return !!this.mouseAnchor;
    }

    public mouseAnchor?: Vector2;
    public delta: Vector2 = { x: 0, y: 0 };

    constructor(
        private onDragging: (delta: Vector2) => void,
        private onDraggingStopped: (delta: Vector2) => void
    ) {}

    public onDragStart = (event: MouseEvent) => {
        this.mouseAnchor = { x: event.clientX, y: event.clientY };
        window.addEventListener('mousemove', this.onDrag);
        window.addEventListener('mouseup', this.onDragStop);
    };

    public onDrag = (event: MouseEvent) => {
        if (!this.isDragging) {
            return;
        }

        this.delta = {
            x: event.clientX - this.mouseAnchor!.x,
            y: event.clientY - this.mouseAnchor!.y,
        };

        this.onDragging(this.delta);
    };

    public onDragStop = (event: MouseEvent) => {
        if (!this.isDragging) {
            return;
        }

        this.onDraggingStopped(this.delta);

        window.removeEventListener('mousemove', this.onDrag);
        window.removeEventListener('mouseup', this.onDragStop);
        this.mouseAnchor = undefined;
        this.delta = { x: 0, y: 0 };
    };
}
