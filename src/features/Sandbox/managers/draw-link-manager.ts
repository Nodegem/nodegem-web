import { getCenterCoordinates } from 'utils';
import DrawLinkController, { DrawArgs } from '../Link/draw-link-controller';
import FakeLinkController from '../Link/fake-link-controller';
import LinkController from '../Link/link-controller';
import { isValidConnection } from '../utils';

export class DrawLinkManager implements IDisposable {
    public drawLinkController: DrawLinkController;

    public modifiedLink?: {
        link: LinkController;
        startElement: HTMLElement;
    };

    public fakeLink: FakeLinkController;

    constructor(
        private getMousePos: () => Vector2,
        private getLinkByNode: (
            nodeId: string,
            portId: string
        ) => LinkController | undefined,
        private removeLink: (id: string) => void,
        private convertCoordinates: (coordinates: Vector2) => Vector2,
        private getNode: (nodeId: string) => INodeUIData | undefined,
        private addLink: (start: DrawArgs, end: DrawArgs) => void,
        private onLinkError: (message: string) => void
    ) {
        this.drawLinkController = new DrawLinkController(
            this.handleDrawStart,
            this.handleDrawing,
            this.handleDrawEnd
        );

        this.fakeLink = new FakeLinkController();
    }

    public toggleDraw = (
        event: PortEvent,
        element: HTMLElement,
        data: IPortUIData,
        node: INodeUIData
    ): void => {
        this.drawLinkController.toggleDraw(
            event,
            element,
            { ...data, nodeId: node.id },
            node
        );
    };

    public stopDrawing = () => {
        if (this.drawLinkController.isDrawing) {
            this.drawLinkController.stopDrawing();
        }
    };

    private handleDrawing = () => {
        this.fakeLink.update(this.getMousePos());
    };

    private handleDrawStart = (source: DrawArgs) => {
        let startElement = source.element;
        if (
            source.data.connected &&
            !(source.data.io === 'output' && source.data.type === 'value')
        ) {
            const link = this.getLinkByNode(source.node.id, source.data.id);

            if (link) {
                startElement = link.getOppositePortElement(source.element);
                this.removeLink(link.id);
                // link.toggleConnectingOppositePort(source.element);

                this.modifiedLink = {
                    link,
                    startElement,
                };
            }
        }

        const start = this.convertCoordinates(
            getCenterCoordinates(startElement)
        );

        this.fakeLink.begin(start, source.data.type);
        this.fakeLink.update(this.getMousePos());
    };

    private handleDrawEnd = (s: DrawArgs, d: DrawArgs) => {
        if (s && d) {
            if (this.modifiedLink) {
                const { link, startElement } = this.modifiedLink;
                const start = {
                    element: startElement,
                    data: link.getSourceData(startElement),
                    node: this.getNode(link.getSourceNodeId(startElement))!,
                };
                const destination =
                    s === d
                        ? {
                              element: link.getOppositePortElement(
                                  startElement
                              ),
                              data: link.getOppositeData(startElement),
                              node: this.getNode(
                                  link.getOppositeNodeId(startElement)
                              )!,
                          }
                        : d;

                if (
                    isValidConnection(
                        { ...start.data, nodeId: start.node.id },
                        {
                            ...destination.data,
                            nodeId: destination.node.id,
                        }
                    )
                ) {
                    this.addLink(start, destination);
                } else {
                    this.onLinkError('Not a valid connection');
                    link.dispose();
                }
            } else {
                if (
                    isValidConnection(
                        { ...s.data, nodeId: s.node.id },
                        { ...d.data, nodeId: d.node.id }
                    )
                ) {
                    this.addLink(s, d);
                } else {
                    this.onLinkError('Not a valid connection');
                }
            }
        } else if (s) {
            if (this.modifiedLink) {
                const { link } = this.modifiedLink;
                link.dispose();
            }
        }

        this.fakeLink.stop();
        this.modifiedLink = undefined;
    };

    public dispose() {
        this.fakeLink.dispose();
        this.drawLinkController.dispose();
    }
}
