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

    public get ports(): Map<
        string,
        { port: IPortUIData; element: HTMLElement }
    > {
        return this._ports;
    }

    public get hasLoaded(): boolean {
        return this.element && this.portCount === this.ports.size;
    }

    private get portCount(): number {
        const {
            flowInputs,
            flowOutputs,
            valueInputs,
            valueOutputs,
        } = this.nodeData.portData;
        return [...flowInputs, ...flowOutputs, ...valueInputs, ...valueOutputs]
            .length;
    }

    private _links: Map<string, LinkController> = new Map();
    private _ports: Map<
        string,
        { port: IPortUIData; element: HTMLElement }
    > = new Map();

    private moveable: Moveable;
    private element: HTMLElement;

    constructor(
        private _nodeData: INodeUIData,
        private canvasContainer: CanvasController,
        private portEvent: PortClickEvent,
        private onMove?: (node: NodeController) => void,
        private onDblClick?: (node: NodeController) => void
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

        this.element.addEventListener(
            'dblclick',
            () => this.onDblClick && this.onDblClick(this)
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

    public getPortRef = (port: IPortUIData, element: HTMLElement) => {
        if (!this._ports.has(port.id)) {
            this._ports.set(port.id, { port, element });
        }
    };

    public removePortRef = (id: string) => {
        if (this._ports.has(id)) {
            this._ports.delete(id);
        }
    };

    public dispose(): void {
        if (this.moveable) {
            this.moveable.dispose();
        }

        this._ports.forEach(p => p.element.remove());
        this._ports.clear();
    }
}

export default NodeController;
