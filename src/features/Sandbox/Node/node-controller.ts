import { computed } from 'mobx';
import Moveable from '../interactive/moveable';
import CanvasController from '../Sandbox/Canvas/canvas-controller';

type PortClickEvent = (
    event: PortEvent,
    element: HTMLElement,
    data: IPortData
) => void;

class NodeController<TNode extends INodeData = any> implements IDisposable {
    @computed
    public get id(): string {
        return this._nodeData.id;
    }

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
        private portEvent: PortClickEvent
    ) {}

    public getElementRef = (element: HTMLElement) => {
        if (!element) {
            return;
        }

        if (this.element === element) {
            return;
        }

        this.element = element;
        if (this.moveable) {
            this.moveable.dispose();
        }

        this.moveable = new Moveable(element, this.canvasContainer);
        if (this._nodeData.position) {
            this.moveable.position = this._nodeData.position;
        }
    };

    public onPortEvent = (
        event: PortEvent,
        element: HTMLElement,
        data: IPortData
    ) => {
        this.portEvent(event, element, data);
    };

    public dispose(): void {
        this.moveable.dispose();
    }
}

export default NodeController;
