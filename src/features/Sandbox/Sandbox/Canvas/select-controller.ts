import CanvasController from './canvas-controller';

const selectingClass = 'selecting';

type SelectedEvent = (bounds: Bounds) => void;

class SelectController implements IDisposable {
    public get selecting(): boolean {
        return !!this.start;
    }

    private selectElement: HTMLElement;
    private start: Vector2 | null;

    constructor(
        private canvasContainer: CanvasController,
        private onSelected: SelectedEvent
    ) {
        this.selectElement = document.createElement('div');
        this.selectElement.style.zIndex = '999';
        this.selectElement.classList.add('select-container');
        this.canvasContainer.canvas.appendChild(this.selectElement);
    }

    public startSelect(pos: Vector2) {
        this.selectElement.classList.add(selectingClass);
        this.start = pos;
    }

    public stopSelect(pos: Vector2) {
        if (!this.selecting) {
            return;
        }

        this.selectElement.classList.remove(selectingClass);
        const { x, y } = this.start!;
        this.onSelected({
            left: x,
            top: y,
            width: pos.x - x,
            height: pos.y - y,
        });

        this.start = null;
    }

    public dispose(): void {
        this.selectElement.remove();
    }
}

export default SelectController;
