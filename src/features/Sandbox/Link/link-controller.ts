import { getCenterCoordinates } from 'utils';
import CanvasController from '../Sandbox/Canvas/canvas-controller';

export const flowPath = (source: Vector2, destination: Vector2) => {
    const hx1 = source.y + Math.abs(destination.y - source.y) * 0.5;
    const hx2 = destination.y - Math.abs(destination.y - source.y) * 0.5;
    return `M ${source.x} ${source.y} C ${hx1} ${source.y} ${hx2} ${
        destination.y
    } ${destination.x} ${destination.y}`;
};

export const valuePath = (source: Vector2, destination: Vector2) => {
    const hx1 = source.y + Math.abs(destination.y - source.y) * 0.5;
    const hx2 = destination.y - Math.abs(destination.y - source.y) * 0.5;
    return `M ${source.x} ${source.y} C ${hx1} ${source.y} ${hx2} ${
        destination.y
    } ${destination.x} ${destination.y}`;
};

export default class LinkController<T extends ILinkUIData = any>
    implements IDisposable {
    private element: SVGPathElement;

    public get id(): string {
        return `${this._linkData.sourceNodeId}|${
            this._linkData.sourceData.id
        }|${this._linkData.destinationNodeId}|${
            this._linkData.destinationData.id
        }`;
    }

    public get sourceNodeId(): string {
        return this._linkData.sourceNodeId;
    }

    public get destinationNodeId(): string {
        return this._linkData.destinationNodeId;
    }

    constructor(
        private _linkData: T,
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

    public dispose(): void {
        this._linkData.sourceData.connected = false;
        this._linkData.destinationData.connected = false;
        this.element.remove();
    }
}
