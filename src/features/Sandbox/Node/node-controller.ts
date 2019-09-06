import Moveable from '../interactive/moveable';
import LinkController from '../Link/link-controller';
import CanvasController from '../Sandbox/Canvas/canvas-controller';

type PortClickEvent = (
    event: PortEvent,
    element: HTMLElement,
    data: IPortUIData,
    node: NodeController
) => void;

class NodeController implements IDisposable {
    public get id(): string {
        return this._nodeData.id;
    }

    public get position(): Vector2 {
        return this.moveable.position;
    }

    public get nodeData(): INodeUIData {
        return this._nodeData;
    }

    public get links(): LinkController[] {
        return Array.from(this._links.values());
    }

    private _links: Map<string, LinkController> = new Map();

    private moveable: Moveable;
    private element: Element;

    constructor(
        private _nodeData: INodeUIData,
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
        this._links.set(link.id, link);
    };

    public removeLink = (link: LinkController) => {
        this._links.delete(link.id);
    };

    public updateLinks = () => {
        this._links.forEach(x => x.update());
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
