import { isInput } from '../../../../utils';

export type DragStartEvent = (e: MouseEvent) => void;
export type DragTranslateEvent = (x: number, y: number, e: MouseEvent) => void;
export type DragUpEvent = (e: MouseEvent) => void;

const backgroundClassName = 'mouse-drag';

export class Drag {
    mouseStart: [number, number] | null;
    el: HTMLElement;
    onTranslate: DragTranslateEvent;
    onStart: DragStartEvent;
    onDragUp: DragUpEvent;

    constructor(
        el: HTMLElement,
        onTranslate: DragTranslateEvent = () => {},
        onStart: DragStartEvent = () => {},
        onDragUp: DragUpEvent = () => {}
    ) {
        this.mouseStart = null;

        this.el = el;
        this.onTranslate = onTranslate;
        this.onStart = onStart;
        this.onDragUp = onDragUp;

        this.initEvents(el);
    }

    initEvents(el) {
        el.addEventListener('mousedown', this.down.bind(this));
        window.addEventListener('mousemove', this.move.bind(this));
        window.addEventListener('mouseup', this.up.bind(this));

        el.addEventListener('touchstart', this.down.bind(this));
        window.addEventListener('touchmove', this.move.bind(this), {
            passive: false,
        });
        window.addEventListener('touchend', this.up.bind(this));
    }

    getCoords(e): [number, number] {
        const props = e.touches ? e.touches[0] : e;

        return [props.pageX, props.pageY];
    }

    down(e: MouseEvent) {
        const target = e.target || e.srcElement;
        if (isInput(target as Element)) return;

        if (e.which === 3) return;

        e.stopPropagation();
        this.el.firstElementChild!.classList.add(backgroundClassName);
        this.mouseStart = this.getCoords(e);

        this.onStart(e);
    }

    move(e) {
        if (!this.mouseStart) return;
        e.preventDefault();
        e.stopPropagation();

        let [x, y] = this.getCoords(e);
        let delta = [x - this.mouseStart[0], y - this.mouseStart[1]];
        let zoom = this.el.getBoundingClientRect().width / this.el.offsetWidth;

        this.onTranslate(delta[0] / zoom, delta[1] / zoom, e);
    }

    up(e) {
        if (!this.mouseStart) return;

        this.el.firstElementChild!.classList.remove(backgroundClassName);

        this.mouseStart = null;
        this.onDragUp(e);
    }
}
