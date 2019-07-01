import { clamp } from '@utils';
import { Emitter } from '../core/emitter';
import { Drag } from './drag';
import { Zoom } from './zoom';

export class Area extends Emitter {
    public el: HTMLElement;
    public container: HTMLElement;
    public transform: { k: number; x: number; y: number };
    public mouse: XYPosition;
    public startPosition: XYPosition;
    public zoomController: Zoom;
    public drag: Drag;

    constructor(container: HTMLElement, emitter: Emitter) {
        super(emitter);

        const el = (this.el = document.createElement('div'));
        el.setAttribute('class', 'area-view-container');

        this.container = container;
        this.transform = { k: 1, x: 0, y: 0 };
        this.mouse = { x: 0, y: 0 };

        el.style.transformOrigin = '0 0';

        this.startPosition = { x: this.transform.x, y: this.transform.y };
        this.zoomController = new Zoom(
            container,
            el,
            0.1,
            this.onZoom.bind(this)
        );
        this.drag = new Drag(
            container,
            this.onTranslate.bind(this),
            this.onStart.bind(this)
        );
        this.container.addEventListener('mousemove', this.mousemove.bind(this));

        this.update();
    }

    public update() {
        const t = this.transform;

        this.el.style.transform = `translate(${t.x}px, ${t.y}px) scale(${t.k})`;
    }

    public mousemove(e) {
        const rect = this.el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const k = this.transform.k;

        this.mouse = { x: x / k, y: y / k };
        this.trigger('mousemove', { ...this.mouse });
    }

    public onStart() {
        this.startPosition = { x: this.transform.x, y: this.transform.y };
    }

    public onTranslate(dx, dy) {
        const { x, y } = this.startPosition;
        this.translate(x + dx, y + dy);
    }

    public onZoom(delta, ox, oy) {
        this.zoom(this.transform.k * (1 + delta), ox, oy);
        this.update();
    }

    public translate(x, y) {
        const params = { transform: this.transform, x, y };

        if (!this.trigger('translate', params)) {
            return;
        }

        this.transform.x = x;
        this.transform.y = y;

        this.update();

        this.trigger('translated');
    }

    public zoom(zoom, ox = 0, oy = 0) {
        const k = this.transform.k;
        const params = {
            transform: this.transform,
            zoom: clamp(zoom, 0.4, 2.5),
        };

        if (!this.trigger('zoom', params)) {
            return;
        }

        const d = (k - params.zoom) / (k - zoom || 1);

        this.transform.k = params.zoom || 1;
        this.transform.x += ox * d;
        this.transform.y += oy * d;

        this.update();
        this.trigger('zoomed');
    }

    public appendChild(el) {
        this.el.appendChild(el);
    }

    public removeChild(el) {
        this.el.removeChild(el);
    }
}
