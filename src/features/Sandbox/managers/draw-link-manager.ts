import { computed, observable } from 'mobx';
import { getCenterCoordinates } from 'utils';
import DrawLinkController, { DrawArgs } from '../Link/draw-link-controller';
import FakeLinkController from '../Link/fake-link-controller';
import LinkController from '../Link/link-controller';
import NodeController from '../Node/node-controller';
import SandboxManager from '../Sandbox/sandbox-manager';
import { isValidConnection } from '../utils';

export class DrawLinkManager implements IDisposable {
    public drawLinkController: DrawLinkController;

    public modifiedLink?: {
        link: LinkController;
        startElement: HTMLElement;
    };

    public fakeLink: FakeLinkController;

    @computed
    public get isDrawing(): boolean {
        return this._isDrawing;
    }

    @observable
    private _isDrawing = false;

    constructor(
        private sandboxManager: SandboxManager,
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
        element: HTMLDivElement,
        data: IPortUIData,
        node: NodeController
    ): void => {
        this.drawLinkController.toggleDraw(event, element, data, node);
    };

    public stopDrawing = () => {
        if (this.isDrawing) {
            this.drawLinkController.stopDrawing();
        }
    };

    private handleDrawing = () => {
        this.fakeLink.update(this.sandboxManager.mousePos);
    };

    private handleDrawStart = (source: DrawArgs) => {
        let startElement = source.element;
        if (
            source.data.connected &&
            !(source.data.io === 'output' && source.data.type === 'value')
        ) {
            const link = this.sandboxManager.getLinkByNode(
                source.node.id,
                source.data.id
            );

            if (link) {
                startElement = link.getOppositePortElement(source.element);
                this.sandboxManager.removeLink(link.id);
                link.toggleConnectingOppositePort(source.element);

                this.modifiedLink = {
                    link,
                    startElement,
                };
            }
        } else {
            source.data.connecting = true;
        }

        const start = this.sandboxManager.convertCoordinates(
            getCenterCoordinates(startElement)
        );

        this._isDrawing = true;
        this.fakeLink.begin(start, source.data.type);
        this.fakeLink.update(this.sandboxManager.mousePos);
    };

    private handleDrawEnd = (s: DrawArgs, d: DrawArgs) => {
        if (s && d) {
            if (this.modifiedLink) {
                const { link, startElement } = this.modifiedLink;
                const start = {
                    element: startElement,
                    data: link.getSourceData(startElement),
                    node: this.sandboxManager.getNode(
                        link.getSourceNodeId(startElement)
                    )!,
                };
                const destination =
                    s === d
                        ? {
                              element: link.getOppositePortElement(
                                  startElement
                              ),
                              data: link.getOppositeData(startElement),
                              node: this.sandboxManager.getNode(
                                  link.getOppositeNodeId(startElement)
                              )!,
                          }
                        : d;

                if (
                    isValidConnection(
                        { nodeId: start.node.id, port: start.data },
                        {
                            nodeId: destination.node.id,
                            port: destination.data,
                        }
                    )
                ) {
                    this.sandboxManager.addLink(start, destination);
                } else {
                    this.onLinkError('Not a valid connection');
                    link.dispose();
                }
            } else {
                if (
                    isValidConnection(
                        { nodeId: s.node.id, port: s.data },
                        { nodeId: d.node.id, port: d.data }
                    )
                ) {
                    this.sandboxManager.addLink(s, d);
                } else {
                    this.onLinkError('Not a valid connection');
                }
            }
            s.data.connecting = false;
            d.data.connecting = false;
        } else if (s) {
            s.data.connecting = false;
            if (this.modifiedLink) {
                const { link } = this.modifiedLink;
                link.dispose();
            }
        }

        this.fakeLink.stop();
        this._isDrawing = false;
        this.modifiedLink = undefined;
    };

    public dispose() {
        this.fakeLink.dispose();
        this.drawLinkController.dispose();
        this._isDrawing = false;
    }
}
