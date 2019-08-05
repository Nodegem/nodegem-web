import Moveable from '../interactive/moveable';
import CanvasContainer from '../Sandbox/Canvas/canvas-container';

class NodeController<TNode = any> {
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
        private canvasContainer: CanvasContainer
    ) {}

    public getElementRef = (element: HTMLElement) => {
        this.element = element;
        this.moveable = new Moveable(element, this.canvasContainer);
    };
}

export default NodeController;
