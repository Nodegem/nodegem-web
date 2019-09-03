import Moveable from '../interactive/moveable';
import LinkController from '../Link/link-controller';
import CanvasController from '../Sandbox/Canvas/canvas-controller';

type PortClickEvent = (
    event: PortEvent,
    element: HTMLElement,
    data: IPortUIData,
    node: NodeController
) => void;

class NodeController<TNode extends INodeUIData = any> implements IDisposable {
    public get id(): string {
        return this._nodeData.id;
    }

    public get position(): Vector2 {
        return this.moveable.position;
    }

    public get nodeData(): TNode {
        return this._nodeData;
    }

    private links: Map<string, LinkController> = new Map();

    private moveable: Moveable;
    private element: Element;

    constructor(
        private _nodeData: TNode,
        private canvasContainer: CanvasController,
        private portEvent: PortClickEvent,
        private onMove?: (node: NodeController) => void
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

        this.moveable = new Moveable(
            element,
            this.canvasContainer,
            () => this.onMove && this.onMove(this),
            this._nodeData.position
        );
    };

    public addLink = (link: LinkController) => {
        this.links.set(link.id, link);
    };

    public removeLink = (link: LinkController) => {
        this.links.delete(link.id);
    };

    public updateLinks = () => {
        this.links.forEach(x => x.update());
    };

    public onPortEvent = (
        event: PortEvent,
        element: HTMLElement,
        data: IPortUIData
    ) => {
        this.portEvent(event, element, data, this);
    };

    public dispose(): void {
        this.moveable.dispose();
    }
}

export default NodeController;
