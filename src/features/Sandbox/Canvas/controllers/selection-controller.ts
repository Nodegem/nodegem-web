import CanvasController from './canvas-controller';

const selectingClass = 'selecting';

type SelectedEvent = (bounds: Bounds) => void;

class SelectionController {
    public get selecting(): boolean {
        return !!this.start;
    }

    private selectElement: HTMLElement;
    private start: Vector2 | null;

    constructor(
        private canvasContainer: CanvasController,
        private onSelection: SelectedEvent
    ) {
        this.selectElement = document.createElement('div');
        this.selectElement.style.position = 'absolute';
        this.selectElement.style.display = 'none';
        this.selectElement.classList.add('select-container');
        this.canvasContainer.canvas.appendChild(this.selectElement);

        this.selectElement.addEventListener('transitionend', event => {
            const target = event.target as HTMLElement;
            if (target && !target.classList.contains(selectingClass)) {
                this.selectElement.style.display = 'none';
                this.selectElement.style.width = '0px';
                this.selectElement.style.height = '0px';
                this.start = null;
            }
        });
    }

    public startSelect(pos: Vector2) {
        this.selectElement.style.display = 'block';
        this.selectElement.classList.add(selectingClass);
        this.start = pos;
        const { x, y } = pos;

        window.addEventListener('mousemove', this.onSelecting);
        window.addEventListener('mouseup', this.onMouseUp);
        this.selectElement.style.transform = `translate(${x}px, ${y}px)`;
    }

    private onSelecting = (event: MouseEvent) => {
        if (!this.selecting) {
            return;
        }

        const { x, y } = this.start!;
        const mousePos = this.canvasContainer.mousePos;

        let { width, height } = {
            width: mousePos.x - x,
            height: mousePos.y - y,
        };
        let { nX, nY } = { nX: x, nY: y };

        if (width < 0) {
            width = Math.abs(width);
            nX = mousePos.x;
        }

        if (height < 0) {
            height = Math.abs(height);
            nY = mousePos.y;
        }

        this.selectElement.style.transform = `translate(${nX}px, ${nY}px)`;
        this.selectElement.style.width = width + 'px';
        this.selectElement.style.height = height + 'px';
    };

    private onMouseUp = (event: MouseEvent) => {
        this.stopSelect(this.canvasContainer.mousePos);
    };

    public stopSelect(pos: Vector2) {
        if (!this.selecting) {
            return;
        }
        this.selectElement.classList.remove(selectingClass);
        let { x, y } = this.start!;
        const mousePos = this.canvasContainer.mousePos;

        let width = pos.x - x;
        let height = pos.y - y;

        if (width < 0) {
            width = Math.abs(width);
            x = mousePos.x;
        }

        if (height < 0) {
            height = Math.abs(height);
            y = mousePos.y;
        }

        this.onSelection({
            left: x,
            top: y,
            width,
            height,
        });

        this.start = null;

        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('mousemove', this.onSelecting);
    }
}

export default SelectionController;
