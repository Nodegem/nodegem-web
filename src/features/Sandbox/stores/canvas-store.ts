import { uuid } from 'lodash-uuid';
import { compose, Store } from 'overstated';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { getCenterCoordinates } from 'utils';
import { sandboxDroppableId, ZoomBounds } from '..';
import CanvasController from '../Canvas/controllers/canvas-controller';
import SelectionController from '../Canvas/controllers/selection-controller';
import { nodeSelectDroppableId } from '../NodeSelect';
import { definitionToNode } from '../utils';
import { generateLinkId, updateLinkPath } from './../utils/link-utils';
import { getPort, getPortId } from './../utils/node-utils';
import { DrawLinkStore } from './draw-link-store';
import { SandboxStore } from './sandbox-store';

interface ICanvasState {
    nodes: INodeUIData[];
    links: ILinkUIData[];
    linksVisible: boolean;
    scale: number;
    openContext?: { id: string; canDelete: boolean };
}

interface ICanvasChildren {
    drawLinkStore: DrawLinkStore;
}

interface INodeUIDataWithLinks extends INodeUIData {
    links: string[];
}

@compose({
    drawLinkStore: DrawLinkStore,
})
export class CanvasStore extends Store<
    ICanvasState,
    SandboxStore,
    ICanvasChildren
> {
    public state: ICanvasState = {
        nodes: [],
        links: [],
        linksVisible: true,
        scale: 1,
    };

    public get mousePos(): Vector2 {
        return this.canvasController.mousePos;
    }

    public get nodeCache(): NodeCache {
        const { hasActiveTab, activeTab } = this.ctx.tabsStore;
        return (hasActiveTab && activeTab.definitions) || ({} as any);
    }

    public canvasController: CanvasController;

    private _nodes: Map<string, INodeUIDataWithLinks> = new Map();
    private _links: Map<string, ILinkUIData> = new Map();

    private selectController: SelectionController;
    private bounds: Dimensions;
    private zoomBounds?: ZoomBounds;

    public bindElement = (
        element: HTMLDivElement,
        bounds: Dimensions,
        zoomBounds?: ZoomBounds
    ) => {
        this.bounds = bounds;
        this.zoomBounds = zoomBounds;

        this.canvasController = new CanvasController(
            element,
            this.bounds,
            this.zoomBounds,
            this.handleCanvasDown,
            this.onCanvasMouseUp,
            this.onCanvasRightClick,
            scale => this.setState({ scale })
        );

        this.selectController = new SelectionController(
            this.canvasController,
            this.handleSelection
        );
    };

    public onCanvasDrag = (
        result: DropResult,
        provided: ResponderProvided
    ): void => {
        const { hasActiveTab } = this.ctx.tabsStore;
        if (!hasActiveTab || !result.destination) {
            return;
        }
        if (
            result.source.droppableId.startsWith(nodeSelectDroppableId) &&
            result.destination.droppableId === sandboxDroppableId
        ) {
            const { definitionLookup } = this.nodeCache;
            this.createNodeFromDefinition(
                definitionLookup[result.draggableId],
                false
            );
        }
    };

    public createNodeFromDefinition = (
        definition: NodeDefinition,
        centered = false
    ) => {
        const { definitionLookup } = this.nodeCache;

        const offset = { x: 75, y: 25 };
        const mousePos = this.mousePos;

        const node = definitionToNode(
            definitionLookup[definition.fullName],
            centered
                ? { x: 0, y: 0 }
                : {
                      x: mousePos.x - offset.x,
                      y: mousePos.y - offset.y,
                  }
        );

        this.addNode(node);
    };

    public addNode = (node: INodeUIData) => {
        this._nodes.set(node.id, {
            ...node,
            links: [],
        });
        this.setState({ nodes: Array.from(this._nodes.values()) });
    };

    public getNode = (nodeId: string) => {
        return this._nodes.get(nodeId);
    };

    public getLinkByNode = (nodeId: string, portId: string) => {
        const node = this._nodes.get(nodeId);
        if (node) {
            const links = node.links.map(l => this._links.get(l)!);
            return links.firstOrDefault(
                x =>
                    x.destinationData.id === portId ||
                    x.sourceData.id === portId
            );
        }

        return undefined;
    };

    public addLink = async (
        source: {
            element: HTMLElement;
            data: IPortUIData;
            node: INodeUIData;
        },
        destination: {
            element: HTMLElement;
            data: IPortUIData;
            node: INodeUIData;
        },
        render = true
    ) => {
        const linkId = generateLinkId(
            source.node.id,
            source.data,
            destination.node.id,
            destination.data
        );
        const linkData: ILinkUIData = {
            id: linkId,
            source: source.element,
            sourceData: source.data,
            sourceNodeId: source.node.id,
            destination: destination.element,
            destinationData: destination.data,
            destinationNodeId: destination.node.id,
            type: source.data.type,
            element: null as any,
        };

        this._links.set(linkId, linkData);

        this.togglePortConnected(source.data, true);
        this.togglePortConnected(destination.data, true);
        await this.setState({ links: Array.from(this._links.values()) });

        const element = document.getElementById(linkId) as any;

        const linkDataWithElement = { ...linkData, element };
        this._links.set(linkId, linkDataWithElement);

        const sourceNode = this._nodes.get(source.node.id);
        if (sourceNode) {
            sourceNode.links.push(linkId);
        }

        const destinationNode = this._nodes.get(destination.node.id);
        if (destinationNode) {
            destinationNode.links.push(linkId);
        }

        if (render) {
            this.updateLinkPaths([linkDataWithElement]);
        }
    };

    public async load(nodes: INodeUIData[], links: ILinkInitializeData[]) {
        this.clearView();

        this.suspend();
        for (const node of nodes) {
            this.addNode(node);
        }
        this.unsuspend();

        for (const link of links) {
            const sourceNode = this._nodes.get(link.sourceNodeId);
            const destinationNode = this._nodes.get(link.destinationNodeId);
            if (!sourceNode || !destinationNode) {
                continue;
            }
            const sourcePort = getPort(sourceNode, link.sourceData.id);
            const destinationPort = getPort(
                destinationNode,
                link.destinationData.id
            );

            if (!sourcePort || !destinationPort) {
                continue;
            }

            await this.addLink(
                {
                    node: sourceNode,
                    data: sourcePort,
                    element: document.getElementById(
                        getPortId(sourcePort)
                    ) as HTMLElement,
                },
                {
                    node: destinationNode,
                    data: destinationPort,
                    element: document.getElementById(
                        getPortId(destinationPort)
                    ) as HTMLElement,
                },
                false
            );
        }

        this.updateLinkPaths(Array.from(this._links.values()));
    }

    public onNodePositionUpdate = (nodeId: string, position: Vector2) => {
        this.updateNode(nodeId, _ => ({
            position,
        }));
    };

    public clearNodes() {
        this._nodes.clear();
        this.setState({ nodes: [] });
    }

    public clearLinks = () => {
        this._links.clear();
        this.setState({ links: [] });
    };

    public resetView = () => {
        this.canvasController.reset();
    };

    public clearView() {
        this.clearNodes();
        this.clearLinks();
    }

    public toggleLinkVisibility = (toggle?: boolean) => {
        this.setState({
            linksVisible: this.state.linksVisible.toggle(toggle),
        });
    };

    public onNodeMove = async (nodeId: string) => {
        const node = this._nodes.get(nodeId);
        if (node) {
            this.updateLinkPathsFromIds(node.links);
        }
    };

    public editNode = (id: string) => {
        this.ctx.nodeInfoStore.toggleOpen(true);
        this.ctx.nodeInfoStore.setSelectedNode(this._nodes.get(id)!);
    };

    public removeLink = (linkId: string) => {
        const link = this._links.get(linkId);
        if (link) {
            this.suspend();
            this.togglePortConnected(link.sourceData, false);
            this.togglePortConnected(link.destinationData, false);

            this.removeLinkFromNode(link.sourceNodeId, linkId);
            this.removeLinkFromNode(link.destinationNodeId, linkId);

            this._links.delete(linkId);
            this.setState({ links: Array.from(this._links.values()) });
            this.unsuspend();
        }
    };

    private removeLinkFromNode = (nodeId: string, linkId: string) => {
        const node = this.getNode(nodeId);
        if (node) {
            node.links = node.links.filter(x => x !== linkId);
        }
    };

    public removeNode = async (nodeId: string) => {
        const node = this.getNode(nodeId);
        if (node) {
            this.suspend();
            const linkIds = [...node.links];

            for (const linkId of linkIds) {
                this.removeLink(linkId);
            }

            this._nodes.delete(nodeId);
            this.setState({
                nodes: Array.from(this._nodes.values()),
            });
            this.unsuspend();
        }
    };

    public onNodeClick = (event: MouseEvent, nodeId: string) => {
        if (event.ctrlKey) {
            this.updateNode(nodeId, _ => ({
                selected: true,
            }));
        } else {
            this.suspend();
            const nodeIds = Array.from(this._nodes.keys());

            nodeIds.forEach(id =>
                this.updateNode(id, _ => ({
                    selected: false,
                }))
            );

            this.updateNode(nodeId, _ => ({
                selected: true,
            }));
            this.unsuspend();
        }
    };

    public onNodeDblClick = (event: MouseEvent, nodeId: string) => {
        event.stopPropagation();

        this.suspend();
        const nodeIds = Array.from(this._nodes.keys());

        nodeIds.forEach(id =>
            this.updateNode(id, _ => ({
                selected: false,
            }))
        );

        const node = this.getNode(nodeId);
        this.updateNode(nodeId, _ => ({
            selected: true,
        }));

        this.ctx.nodeInfoStore.toggleOpen(true);
        this.ctx.nodeInfoStore.setSelectedNode(node!);
        this.unsuspend();
    };

    public onNodeRightClick = (event: MouseEvent, nodeId: string) => {
        event.preventDefault();

        const node = this.getNode(nodeId)!;
        this.setState({
            openContext: { id: nodeId, canDelete: !node.permanent },
        });
    };

    public updateNode = async (
        id: string,
        newDataFunc: (node: INodeUIData) => Partial<INodeUIData>,
        updatePathLinks?: boolean
    ) => {
        const oldNode = this.getNode(id);
        if (oldNode) {
            const newNode = { ...oldNode, ...newDataFunc(oldNode) };
            this._nodes.set(id, newNode);
            await this.setState({ nodes: Array.from(this._nodes.values()) });

            if (updatePathLinks) {
                this.updateLinkPathsFromIds(newNode.links);
            }
        }
    };

    //#region Port methods

    public updateNodePort = (
        node: INodeUIData,
        port: IPortUIData,
        newPortData: (oldPort: IPortUIData) => Partial<IPortUIData>
    ): Partial<INodeUIData> => {
        let portListName: keyof Pick<
            INodeUIData,
            'flowInputs' | 'flowOutputs' | 'valueInputs' | 'valueOutputs'
        >;
        // tslint:disable-next-line: prefer-conditional-expression
        if (port.type === 'flow') {
            portListName = port.io === 'input' ? 'flowInputs' : 'flowOutputs';
        } else {
            portListName = port.io === 'input' ? 'valueInputs' : 'valueOutputs';
        }

        const list = node[portListName];
        const existingPort = list.first(x => x.id === port.id);
        list.addOrUpdate(
            { ...existingPort, ...newPortData(existingPort) },
            x => x.id === port.id
        );

        return {
            ...node,
            [portListName]: [...list],
        };
    };

    public updateNodePortList = (
        node: INodeUIData,
        port: IPortUIData,
        newPortsData: (oldPorts: IPortUIData[]) => IPortUIData[]
    ): Partial<INodeUIData> => {
        let portListName: keyof Pick<
            INodeUIData,
            'flowInputs' | 'flowOutputs' | 'valueInputs' | 'valueOutputs'
        >;
        // tslint:disable-next-line: prefer-conditional-expression
        if (port.type === 'flow') {
            portListName = port.io === 'input' ? 'flowInputs' : 'flowOutputs';
        } else {
            portListName = port.io === 'input' ? 'valueInputs' : 'valueOutputs';
        }

        const list = node[portListName];

        return {
            ...node,
            [portListName]: [...newPortsData(list)],
        };
    };

    public togglePortConnected = (port: IPortUIData, value?: boolean) => {
        this.updateNode(port.nodeId, oldNode =>
            this.updateNodePort(oldNode, port, oldPort => ({
                connected: oldPort.connected.toggle(value),
            }))
        );
    };

    public convertCoordinates = (coords: Vector2) => {
        return this.canvasController.convertCoordinates(coords);
    };

    private handleSelection = (bounds: Bounds) => {};

    public onPortAdd = (data: IPortUIData) => {
        const fullId = `${data.name.toLowerCase()}|${uuid().replace(/-/g, '')}`;

        this.updateNode(
            data.nodeId,
            oldNode =>
                this.updateNodePortList(oldNode, data, ports => [
                    ...ports,
                    {
                        ...data,
                        id: fullId,
                        connected: false,
                        value: data.defaultValue,
                    },
                ]),
            true
        );
    };

    public onPortRemove = (data: IPortUIData) => {
        this.updateNode(
            data.nodeId,
            oldNode =>
                this.updateNodePortList(oldNode, data, ports => [
                    ...ports.filter(p => p.id !== data.id),
                ]),
            true
        );
    };

    public onPortEvent = (
        event: PortEvent,
        element: HTMLElement,
        data: IPortUIData,
        nodeId: string
    ) => {
        const node = this.getNode(nodeId);
        if (node) {
            this.drawLinkStore.toggleDraw(event, data, element);
        }
    };

    //#endregion

    //#region Links

    public hasLink = (port: IPortUIData) => {
        const node = this.getNode(port.nodeId);
        if (node) {
            const links = node.links.map(x => this.getLink(x)!);
            return links.any(
                l =>
                    (l.destinationNodeId === port.nodeId &&
                        l.destinationData.id === port.id) ||
                    (l.sourceNodeId === port.nodeId &&
                        l.sourceData.id === port.id)
            );
        }

        return false;
    };

    public getLink = (linkId: string) => {
        return this._links.get(linkId);
    };

    public getLinkFromPort = (port: IPortUIData) => {
        const node = this.getNode(port.nodeId);
        if (node) {
            const links = node.links.map(l => this.getLink(l)!);
            const foundLink = links.firstOrDefault(
                l =>
                    (l.sourceNodeId === port.nodeId &&
                        l.sourceData.id === port.id) ||
                    (l.destinationNodeId === port.nodeId &&
                        l.destinationData.id === port.id)
            );
            return foundLink;
        }

        return undefined;
    };

    private updateLinkPathsFromIds = (linkIds: string[]) => {
        this.updateLinkPaths(linkIds.map(l => this._links.get(l)!));
    };

    private updateLinkPaths = (links: ILinkUIData[]) => {
        links.forEach(x => {
            updateLinkPath(x, element =>
                this.convertCoordinates(getCenterCoordinates(element))
            );
        });
    };

    //#endregion

    //#region  Canvas Events

    private handleCanvasDown = (event: MouseEvent) => {
        if (event.ctrlKey) {
            this.canvasController.toggleDragging(false);
            this.selectController.startSelect(this.canvasController.mousePos);
        } else {
            this.suspend();
            const nodeIds = Array.from(this._nodes.keys());
            nodeIds.forEach(id => {
                this.updateNode(id, _ => ({
                    selected: false,
                }));
            });
            this.unsuspend();
        }
    };

    private onCanvasMouseUp = (event: MouseEvent) => {};

    private onCanvasRightClick = (event: MouseEvent) => {
        if (this.drawLinkStore.state.isDrawing) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.drawLinkStore.stopDraw();
        }
    };

    //#endregion
}
