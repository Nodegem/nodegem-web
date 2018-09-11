import { computed } from "mobx";
import { PortIOType, PortType, AnyPort } from "./types";
import { store } from "../..";
import { Node } from "../Node";
import shortId from 'shortid';
import * as d3 from 'd3';

abstract class Port<IOType extends PortIOType, PType extends PortType> {

    portId: string;
    elementId: string;
    ioType: IOType;
    type: PType;
    label: string;
    key: string;
    node: Node;

    portElement: Element;

    @computed 
    public get connected(): boolean {
        return (store.linking && store.linking.from === this) 
            || store.links.some(x => x.source.port === this || x.destination.port === this);
    }

    public get centerCoords() : XYCoords {
        const { x, y, width, height } = this.portElement.getBoundingClientRect() as DOMRect;
        const [halfWidth, halfHeight] = [width / 2, height / 2];
    
        return [x + halfWidth, y + halfHeight];
    }

    constructor(node: Node, label: string) {
        this.node = node;
        this.label = label;
        this.key = label.toLowerCase();

        const uniqueId = shortId();
        this.elementId = `${node.elementId}-port-${uniqueId}`
        this.portId = `port-${uniqueId}`;
    }

    public onMount = () => {

        const portSelection = d3.select(`#${this.portId}`);
        this.portElement = portSelection.node() as Element;

        portSelection.on("mousedown", () => {
            d3.event.preventDefault();
            d3.event.stopPropagation();

            store.graph.startLink(this as AnyPort, this.centerCoords);
        })

        d3.selectAll(`.${this.elementId}`)
            .on("mouseup", () => {
                d3.event.preventDefault();
                d3.event.stopPropagation();

                store.graph.stopLink();
            });

    }

}

export { Port };