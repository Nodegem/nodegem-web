import Moveable from '../interactive/moveable';
import CanvasController from '../Sandbox/Canvas/canvas-controller';

type PortClickEvent = (element: HTMLElement, data: IPortData) => void;

class NodeController<TNode extends INodeData = any> implements IDisposable {
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
        private canvasContainer: CanvasController,
        private portDownEvent: PortClickEvent
    ) {}

    public getElementRef = (element: HTMLElement) => {
        if (!element) {
            return;
        }
        this.element = element;
        this.moveable = new Moveable(element, this.canvasContainer);
    };

    public onPortDown = (event: MouseEvent, data: IPortData) => {
        event.preventDefault();
        event.stopPropagation();
        this.portDownEvent(event.target as HTMLElement, data);
    };

    public dispose(): void {
        this.moveable.dispose();
    }
}

export default NodeController;
