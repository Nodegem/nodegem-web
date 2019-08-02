import { isInput } from '../../../../utils';

export class Zoom {
    public el: Element;
    public intensity: number;
    public onzoom: (delta: number, x: number, y: number) => void;
    public distance: number | null;

    constructor(container, el, intensity, onzoom) {
        this.el = el;
        this.intensity = intensity;
        this.onzoom = onzoom;

        this.distance = null;

        container.addEventListener('wheel', this.wheel.bind(this));
        container.addEventListener('touchmove', this.move.bind(this));
        container.addEventListener('touchend', this.end.bind(this));
        container.addEventListener('touchcancel', this.end.bind(this));
    }

    public wheel(e) {
        e.preventDefault();

        const rect = this.el.getBoundingClientRect();

        const delta =
            (e.wheelDelta ? e.wheelDelta / 120 : -e.deltaY / 3) *
            this.intensity;

        const ox = (rect.left - e.clientX) * delta;
        const oy = (rect.top - e.clientY) * delta;
        console.log(this.el);

        this.onzoom(delta, ox, oy);
    }

    public touches(e) {
        const [x1, y1] = [e.touches[0].clientX, e.touches[0].clientY];
        const [x2, y2] = [e.touches[1].clientX, e.touches[1].clientY];
        const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

        return {
            cx: (x1 + x2) / 2,
            cy: (y1 + y2) / 2,
            distance,
        };
    }

    public move(e) {
        if (e.touches.length < 2) {
            return;
        }

        const rect = this.el.getBoundingClientRect();
        const { cx, cy, distance } = this.touches(e);

        if (this.distance !== null) {
            const delta = distance / this.distance - 1;

            const ox = (rect.left - cx) * delta;
            const oy = (rect.top - cy) * delta;

            this.onzoom(delta, ox, oy);
        }
        this.distance = distance;
    }

    public end() {
        this.distance = null;
    }

    public dblclick(e) {
        const target = e.target || e.srcElement;
        if (isInput(target)) {
            return;
        }

        e.preventDefault();

        const rect = this.el.getBoundingClientRect();
        const delta = 4 * this.intensity;

        const ox = (rect.left - e.clientX) * delta;
        const oy = (rect.top - e.clientY) * delta;

        this.onzoom(delta, ox, oy);
    }
}
