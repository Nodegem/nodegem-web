import { isInput, isTouchEvent } from 'utils';

export type ZoomEvent = (
    delta: number,
    type: ZoomType,
    position: Vector2
) => void;
export type ZoomType = 'wheel' | 'touch' | 'dblClick';

class ZoomController implements IDisposable {
    private _distance: number | null;

    constructor(
        private parentContainer: HTMLElement,
        private viewContainer: HTMLElement,
        private intensity: number,
        private onZoom: ZoomEvent
    ) {
        this.intensity = intensity;
        this._distance = null;

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

        this.onZoom(delta, 'wheel', { x: ox, y: oy });
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

        if (this._distance !== null) {
            const delta = distance / this._distance - 1;

            const ox = (rect.left - cx) * delta;
            const oy = (rect.top - cy) * delta;

            this.onZoom(delta, 'touch', { x: ox, y: oy });
        }
        this._distance = distance;
    };

    public handleEnd = () => {
        this._distance = null;
    };

    public handleDblClick = (e: MouseEvent) => {
        if (isInput(e.target as Element)) {
            return;
        }

        e.preventDefault();

        const rect = this.viewContainer.getBoundingClientRect();
        const delta = 8 * this.intensity;

        const ox = (rect.left - e.clientX) * delta;
        const oy = (rect.top - e.clientY) * delta;

        this.onZoom(delta, 'dblClick', { x: ox, y: oy });
    };

    public dispose(): void {
        this.parentContainer.removeEventListener('wheel', this.handleWheel);
        this.parentContainer.removeEventListener(
            'dblclick',
            this.handleDblClick
        );
        this.parentContainer.removeEventListener('touchmove', this.handleMove);
        this.parentContainer.removeEventListener('touchend', this.handleEnd);
        this.parentContainer.removeEventListener('touchcancel', this.handleEnd);
    }
}

export default ZoomController;
