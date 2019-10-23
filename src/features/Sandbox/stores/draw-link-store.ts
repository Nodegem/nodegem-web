import { appStore } from 'app-state-store';
import _ from 'lodash';
import { Store } from 'overstated';
import { getCenterCoordinates } from 'utils';
import { CanvasStore } from '.';
import { flowPath, valuePath } from '..';
import {
    getOppositeElementFromId,
    getOppositePortFromId,
    isValidConnection,
} from './../utils/link-utils';

export const drawLinkElementId = 'draw-link';

interface IDrawLinkState {
    isDrawing: boolean;
    linkType?: PortType;
    source?: Vector2;
    portElement?: HTMLElement;
    port?: IPortUIData;
    detachElement?: HTMLElement;
    detachPort?: IPortUIData;
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

    public toggleDraw = (
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
            element !== this.state.detachElement &&
            this.state.isDrawing
        ) {
            this.stopDraw(port, element);
            return;
        }

        if (event === 'down') {
            window.addEventListener('mousemove', this.throttleEvent);
            this.getLinkElement().addEventListener(
                'contextmenu',
                this.handleRightClick
            );

            this.suspend();

            if (this.ctx.hasLink(port)) {
                const { oppositeElement, oppositePort } = this.detachLink(
                    port,
                    element
                );
                this.setState({
                    isDrawing: true,
                    linkType: port.type,
                    source: this.ctx.convertCoordinates(
                        getCenterCoordinates(oppositeElement)
                    ),
                    portElement: oppositeElement,
                    port: oppositePort,
                });
            } else {
                this.ctx.togglePortConnected(port, true);
                this.setState({
                    isDrawing: true,
                    linkType: port.type,
                    source: this.ctx.convertCoordinates(
                        getCenterCoordinates(element)
                    ),
                    portElement: element,
                    port,
                });
            }

            this.ctx.canvasController.toggleDragging(false);
        }

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
                } else {
                    appStore.toast('Invalid connection', 'warn');
                    this.clearConnections(port);
                }
            }
        } else {
            this.clearConnections(port);
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
            detachElement: undefined,
            detachPort: undefined,
        });

        this.ctx.canvasController.toggleDragging(true);
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

    private detachLink = (
        port: IPortUIData,
        originalElement: HTMLElement
    ): { oppositePort: IPortUIData; oppositeElement: HTMLElement } => {
        const existingLink = this.ctx.getLinkFromPort(port)!;
        const oppositePort = getOppositePortFromId(existingLink, port.id);

        this.ctx.removeLink(existingLink.id);
        this.ctx.togglePortConnected(oppositePort, true);

        const element = getOppositeElementFromId(existingLink, port.id);
        this.setState({
            detachElement: originalElement,
            detachPort: oppositePort,
        });
        return { oppositeElement: element, oppositePort };
    };

    private clearConnections = (port?: IPortUIData) => {
        if (port) {
            this.ctx.togglePortConnected(port, false);
        }

        if (this.state.detachPort) {
            this.ctx.togglePortConnected(this.state.detachPort, false);
        }
    };

    private handleRightClick = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        this.stopDraw();
    };
}
