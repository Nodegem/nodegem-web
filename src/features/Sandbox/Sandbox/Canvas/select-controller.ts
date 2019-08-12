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
        this.selectElement.style.position = 'absolute';
        this.selectElement.style.display = 'none';
        this.selectElement.style.zIndex = '999';
        this.selectElement.classList.add('select-container');
        window.addEventListener('mousemove', this.onSelecting);
        this.canvasContainer.canvas.appendChild(this.selectElement);
    }

    public startSelect(pos: Vector2) {
        this.selectElement.style.display = 'block';
        this.selectElement.classList.add(selectingClass);
        this.start = pos;
    }

    private onSelecting = (event: MouseEvent) => {
        if (!this.selecting) {
            return;
        }

        // this.selectElement.style.transform = `translate(${})`;
    };

    public stopSelect(pos: Vector2) {
        this.selectElement.style.display = 'none';
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
        window.removeEventListener('mousemove', this.onSelecting);
    }
}

export default SelectController;
