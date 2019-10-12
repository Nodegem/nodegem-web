import _ from 'lodash';
import NodeController from '../Node/node-controller';

export type DrawArgs = {
    element: HTMLElement;
    data: IPortUIData;
    node: NodeController;
};

class DrawLinkController implements IDisposable {
    private _source?: DrawArgs;

    private throttleEvent: ((event: MouseEvent) => void) & _.Cancelable;

    public get isDrawing() {
        return !!this._source;
    }

    constructor(
        private onDrawStart: (source: DrawArgs) => void,
        private onDrawing: () => void,
        private onDrawEnd: (source?: DrawArgs, destination?: DrawArgs) => void
    ) {
        this.throttleEvent = _.throttle(this.drawing, 5);
    }

    public toggleDraw(
        type: PortEvent,
        source: HTMLElement,
        data: IPortUIData,
        node: NodeController
    ) {
        if (!this.isDrawing && type === 'down') {
            this._source = { element: source, data, node };
            window.addEventListener('contextmenu', this.canvasDownEvent);
            window.addEventListener('mousemove', this.throttleEvent);
            this.onDrawStart(this._source);
        } else {
            if (this.isDrawing) {
                if (
                    type === 'up' &&
                    this._source &&
                    this._source.element === source
                ) {
                    return;
                }

                if (
                    type === 'down' &&
                    this._source &&
                    this._source.element === source
                ) {
                    this.onDrawEnd(this._source, this._source);
                    this.cleanUp();
                    return;
                }

                this.onDrawEnd(this._source!, { element: source, data, node });
                this.cleanUp();
            }
        }
    }

    public stopDrawing = () => {
        this.onDrawEnd(this._source);
        this.cleanUp();
    };

    private cleanUp = () => {
        this._source = undefined;
        window.removeEventListener('mousemove', this.throttleEvent);
        window.removeEventListener('contextmenu', this.canvasDownEvent);
    };

    private canvasDownEvent = (event: MouseEvent) => {
        // event.preventDefault();
        // event.stopPropagation();
        this.stopDrawing();
    };

    private drawing = (event: MouseEvent) => {
        if (!this.isDrawing) {
            return;
        }

        // event.stopPropagation();
        // event.preventDefault();

        this.onDrawing();
    };

    public dispose(): void {
        this.cleanUp();
    }
}

export default DrawLinkController;
