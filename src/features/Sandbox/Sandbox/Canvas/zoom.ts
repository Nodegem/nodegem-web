import { isTouchEvent } from 'utils';
import { Vector2 } from './drag';

export type ZoomEvent = (delta: number, position: Vector2) => void;

class Zoom {
    public distance: number | null;

    constructor(
        private el: HTMLElement,
        private intensity: number,
        private onZoom: ZoomEvent
    ) {
        this.el = el;
        this.intensity = intensity;

        this.distance = null;

        el.addEventListener('wheel', this.handleWheel);
        el.addEventListener('touchmove', this.handleMove);
        el.addEventListener('touchend', this.handleEnd);
        el.addEventListener('touchcancel', this.handleEnd);
    }

    public handleWheel = (e: WheelEvent) => {
        e.preventDefault();

        const rect = this.el.getBoundingClientRect();
        const delta = (-e.deltaY / 120) * this.intensity;

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

        const rect = this.el.getBoundingClientRect();
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

        const rect = this.el.getBoundingClientRect();
        const delta = 4 * this.intensity;

        const ox = (rect.left - e.clientX) * delta;
        const oy = (rect.top - e.clientY) * delta;

        this.onZoom(delta, { x: ox, y: oy });
    };
}

export default Zoom;
