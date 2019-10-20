import _ from 'lodash';
import { Store } from 'overstated';
import { getCenterCoordinates } from 'utils';
import { CanvasStore } from '.';
import { flowPath, valuePath } from '..';
import { isValidConnection } from './../utils/link-utils';

export const drawLinkElementId = 'draw-link';

interface IDrawLinkState {
    isDrawing: boolean;
    linkType?: PortType;
    source?: Vector2;
    portElement?: HTMLElement;
    port?: IPortUIData;
}

export class DrawLinkStore extends Store<IDrawLinkState, CanvasStore> {
    public state: IDrawLinkState = {
        isDrawing: false,
    };

    private linkElement: SVGPathElement;
    private throttleEvent: ((event: MouseEvent) => void) & _.Cancelable;

    constructor() {
        super();
        this.throttleEvent = _.throttle(this.updateLink, 5);
    }

    public startDraw = (
        event: PortEvent,
        port: IPortUIData,
        element: HTMLElement
    ) => {
        if (event === 'down' && this.state.isDrawing) {
            this.stopDraw(port, element);
            return;
        }

        if (
            event === 'up' &&
            element !== this.state.portElement &&
            this.state.isDrawing
        ) {
            this.stopDraw(port, element);
            return;
        }

        window.addEventListener('mousemove', this.throttleEvent);
        this.getLinkElement().addEventListener(
            'contextmenu',
            this.handleRightClick
        );

        this.suspend();
        this.ctx.togglePortConnected(port, true);
        this.setState({
            isDrawing: true,
            linkType: port.type,
            source: this.ctx.convertCoordinates(getCenterCoordinates(element)),
            portElement: element,
            port,
        });
        this.unsuspend();
    };

    public stopDraw = (
        destinationPort?: IPortUIData,
        element?: HTMLElement
    ) => {
        const { port, portElement } = this.state;
        if (destinationPort && element) {
            if (port) {
                const source = {
                    data: port,
                    element: portElement!,
                    node: this.ctx.getNode(port.nodeId)!,
                };
                const destination = {
                    data: destinationPort,
                    element,
                    node: this.ctx.getNode(destinationPort.nodeId)!,
                };
                if (isValidConnection(port, destinationPort)) {
                    this.ctx.addLink(source, destination);
                }
            }
        } else {
            if (port) {
                this.ctx.togglePortConnected(port, false);
            }
        }

        window.removeEventListener('mousemove', this.throttleEvent);
        this.getLinkElement().removeEventListener(
            'contextmenu',
            this.handleRightClick
        );
        this.getLinkElement().setAttribute('d', '');
        this.setState({
            isDrawing: false,
            linkType: undefined,
            source: undefined,
            port: undefined,
            portElement: undefined,
        });
    };

    private updateLink = () => {
        if (!this.state.isDrawing) {
            return;
        }

        const path =
            this.state.linkType === 'flow'
                ? flowPath(this.state.source!, this.ctx.mousePos)
                : valuePath(this.state.source!, this.ctx.mousePos);
        this.getLinkElement().setAttribute('d', path);
    };

    private getLinkElement = () => {
        if (!this.linkElement) {
            this.linkElement = document.getElementById(
                drawLinkElementId
            ) as any;
        }
        return this.linkElement;
    };

    private handleRightClick = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        this.stopDraw();
    };
}
