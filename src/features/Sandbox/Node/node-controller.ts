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
        return this.nodeData.id;
    }

    public get position(): Vector2 {
        return this.moveable.position;
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

    public get portsList(): IPortUIData[] {
        return Array.from(this._ports.values()).map(x => x.port);
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
        public nodeData: INodeUIData,
        private canvasContainer: CanvasController,
        private portEvent: PortClickEvent,
        private onMove?: (node: NodeController) => void,
        private onDblClick?: (node: NodeController) => void,
        private onClick?: (event: MouseEvent, node: NodeController) => void
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
            this.nodeData.position
        );

        this.element.addEventListener(
            'click',
            event => this.onClick && this.onClick(event, this)
        );

        this.element.addEventListener(
            'dblclick',
            () => this.onDblClick && this.onDblClick(this)
        );

        this.element.style.visibility = 'visible'; // hack for jitter
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

    public addPort = (port: IPortUIData) => {
        const split = port.id.split('|');
        if (split.length > 1) {
            const [name, _] = split;
            const count = this.portsList.count(x => x.id.startsWith(name));
            if (port.io === 'input' && port.type === 'value') {
                this.nodeData.portData.valueInputs.push({
                    ...port,
                    id: `${name}|${count}`,
                    value: port.defaultValue,
                    connected: false,
                    connecting: false,
                });
            }
        }
    };

    public removePort = (port: IPortUIData) => {
        if (this._ports.has(port.id)) {
            this._ports.delete(port.id);

            const {
                flowInputs,
                flowOutputs,
                valueInputs,
                valueOutputs,
            } = this.nodeData.portData;
            if (port.io === 'input') {
                if (port.type === 'value') {
                    valueInputs.removeWhere(x => x.id === port.id);
                }
            }
        }
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

    public updatePortValues = (fields: IPortUIData[]) => {
        fields.forEach(f => {
            const existingField = this._ports.get(f.id);
            if (existingField) {
                this._ports.set(f.id, { ...existingField, port: f });
            }
        });
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
