import Moveable from '../interactive/moveable';
import CanvasController from '../Sandbox/Canvas/canvas-controller';

class NodeController<TNode = any> implements IDisposable {
    public get position(): Vector2 {
        return this.moveable.position;
    }

    public get nodeData(): TNode {
        return this._nodeData;
    }

    private moveable: Moveable;
    private element: Element;

    constructor(
        private _nodeData: TNode,
        private canvasContainer: CanvasController
    ) {}

    public getElementRef = (element: HTMLElement) => {
        if (!element) {
            return;
        }
        this.element = element;
        this.moveable = new Moveable(element, this.canvasContainer);
    };

    public dispose(): void {
        this.moveable.dispose();
    }
}

export default NodeController;
