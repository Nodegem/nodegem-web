import { isTouchEvent } from 'utils';

export type ZoomEvent = (delta: number, position: Vector2) => void;

class Zoom {
    public distance: number | null;

    constructor(
        parentContainer: HTMLElement,
        private viewContainer: HTMLElement,
        private intensity: number,
        private onZoom: ZoomEvent
    ) {
        this.intensity = intensity;
        this.distance = null;

        parentContainer.addEventListener('wheel', this.handleWheel);
        parentContainer.addEventListener('dblclick', this.handleDblClick);
        parentContainer.addEventListener('touchmove', this.handleMove);
        parentContainer.addEventListener('touchend', this.handleEnd);
        parentContainer.addEventListener('touchcancel', this.handleEnd);
    }

    public handleWheel = (e: WheelEvent) => {
        e.preventDefault();

        const rect = this.viewContainer.getBoundingClientRect();
        const eLegacy = e as any;
        const delta =
            (eLegacy.wheelDelta ? eLegacy.wheelDelta / 120 : -e.deltaY / 3) *
            this.intensity;

        const ox = (rect.left - e.clientX) * delta;
        const oy = (rect.top - e.clientY) * delta;

        this.onZoom(delta, { x: ox, y: oy });
    };

    public touches(e: TouchEvent) {
        const [x1, y1] = [e.touches[0].clientX, e.touches[0].clientY];
        const [x2, y2] = [e.touches[1].clientX, e.touches[1].clientY];
        const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

        return {
            cx: (x1 + x2) / 2,
            cy: (y1 + y2) / 2,
            distance,
        };
    }

    public handleMove = (e: MouseEvent | TouchEvent) => {
        if (isTouchEvent(e) && e.touches.length < 2) {
            return;
        }

        const rect = this.viewContainer.getBoundingClientRect();
        const { cx, cy, distance } = this.touches(e as TouchEvent);

        if (this.distance !== null) {
            const delta = distance / this.distance - 1;

            const ox = (rect.left - cx) * delta;
            const oy = (rect.top - cy) * delta;

            this.onZoom(delta, { x: ox, y: oy });
        }
        this.distance = distance;
    };

    public handleEnd = () => {
        this.distance = null;
    };

    public handleDblClick = (e: MouseEvent) => {
        e.preventDefault();

        const rect = this.viewContainer.getBoundingClientRect();
        const delta = 4 * this.intensity;

        const ox = (rect.left - e.clientX) * delta;
        const oy = (rect.top - e.clientY) * delta;

        this.onZoom(delta, { x: ox, y: oy });
    };
}

export default Zoom;
