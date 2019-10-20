import { flowPath, valuePath } from './link-controller';

export default class FakeLinkController implements IDisposable {
    public element: SVGPathElement;
    private source?: Vector2;
    private portType?: PortType;

    public get type() {
        return this.portType;
    }

    public getElementRef = (element: SVGPathElement) => {
        this.element = element;
    };

    public begin = (from: Vector2, type: PortType) => {
        this.source = from;
        this.portType = type;
    };

    public update(to: Vector2) {
        if (!this.source || !this.portType) {
            return;
        }

        const path =
            this.portType === 'flow'
                ? flowPath(this.source, to)
                : valuePath(this.source, to);
        this.element.setAttribute('d', path);
    }

    public stop = () => {
        this.source = undefined;
        this.portType = undefined;
    };

    public dispose(): void {
        if (this.element) {
            this.element.remove();
        }
    }
}
