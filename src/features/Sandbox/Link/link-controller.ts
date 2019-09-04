import { getCenterCoordinates } from 'utils';
import CanvasController from '../Sandbox/Canvas/canvas-controller';

export const flowPath = (source: Vector2, destination: Vector2) => {
    const s = source.y < destination.y ? source : destination;
    const d = source.y < destination.y ? destination : source;
    const hy1 = s.y + Math.abs(d.y - s.y) * 0.5;
    const hy2 = d.y - Math.abs(d.y - s.y) * 0.5;
    return `M ${s.x} ${s.y} C ${s.x} ${hy1} ${d.x} ${hy2} ${d.x} ${d.y}`;
};

export const valuePath = (source: Vector2, destination: Vector2) => {
    const s = source.x < destination.x ? source : destination;
    const d = source.x < destination.x ? destination : source;
    const hx1 = s.x + Math.abs(d.x - s.x) * 0.5;
    const hx2 = d.x - Math.abs(d.x - s.x) * 0.5;
    return `M ${s.x} ${s.y} C ${hx1} ${s.y} ${hx2} ${d.y} ${d.x} ${d.y}`;
};

export default class LinkController implements IDisposable {
    private element: SVGPathElement;

    public get id(): string {
        return `${this._linkData.sourceNodeId}|${this._linkData.sourceData.id}|${this._linkData.destinationNodeId}|${this._linkData.destinationData.id}`;
    }

    public get sourceNodeId(): string {
        return this._linkData.sourceNodeId;
    }

    public get sourceElement(): HTMLElement {
        return this._linkData.source;
    }

    public get sourcePortId(): string {
        return this._linkData.sourceData.id;
    }

    public get destinationElement(): HTMLElement {
        return this._linkData.destination;
    }

    public get destinationNodeId(): string {
        return this._linkData.destinationNodeId;
    }

    public get destinationPortId(): string {
        return this._linkData.destinationData.id;
    }

    constructor(
        private _linkData: ILinkUIData,
        private type: PortType,
        private canvasController: CanvasController
    ) {
        this._linkData.sourceData.connected = true;
        this._linkData.destinationData.connected = true;
    }

    public getElementRef = (element: SVGPathElement) => {
        this.element = element;
        this.update();
    };

    private convert = (element: HTMLElement) =>
        this.canvasController.convertCoordinates(getCenterCoordinates(element));

    public update() {
        const source = this.convert(this._linkData.source);
        const destination = this.convert(this._linkData.destination);
        const path =
            this.type === 'flow'
                ? flowPath(source, destination)
                : valuePath(source, destination);
        this.element.setAttribute('d', path);
    }

    public getSourceData = (element: HTMLElement) => {
        return element === this.sourceElement
            ? this._linkData.sourceData
            : this._linkData.destinationData;
    };

    public getSourceNodeId = (element: HTMLElement) => {
        return element === this.sourceElement
            ? this.sourceNodeId
            : this.destinationNodeId;
    };

    public getOppositePortElement = (element: HTMLElement) => {
        return element === this.sourceElement
            ? this.destinationElement
            : this.sourceElement;
    };

    public getOppositeData = (element: HTMLElement) => {
        return element === this.sourceElement
            ? this._linkData.destinationData
            : this._linkData.sourceData;
    };

    public getOppositeNodeId = (element: HTMLElement) => {
        return element === this.sourceElement
            ? this.destinationNodeId
            : this.sourceNodeId;
    };

    public toggleSourcePort = (element: HTMLElement) => {
        if (element === this.sourceElement) {
            this._linkData.sourceData.connected = !this._linkData
                .destinationData.connected;
        } else {
            this._linkData.destinationData.connected = !this._linkData
                .sourceData.connected;
        }
    };

    public toggleOppositePort = (element: HTMLElement) => {
        if (element === this.sourceElement) {
            this._linkData.destinationData.connected = !this._linkData
                .destinationData.connected;
        } else {
            this._linkData.sourceData.connected = !this._linkData.sourceData
                .connected;
        }
    };

    public dispose(): void {
        this._linkData.sourceData.connected = false;
        this._linkData.destinationData.connected = false;
        this.element.remove();
    }
}
