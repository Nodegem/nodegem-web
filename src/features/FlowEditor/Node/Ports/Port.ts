import { computed, observable, action } from "mobx";
import { PortIOType, PortType, AnyPort } from "./types";
import { store } from "../..";
import { Node } from "../Node";
import shortId from 'shortid';
import * as d3 from 'd3';

abstract class Port<IOType extends PortIOType, PType extends PortType> {

    uniqueId: string;
    portId: string;
    elementId: string;
    ioType: IOType;
    type: PType;
    label: string;
    key: string;
    node: Node;

    @observable
    protected port? : AnyPort;

    @observable
    centerCoords : XYCoords = [NaN, NaN];

    portElement: Element;

    @computed
    public get connected(): boolean {
        return !!this.port || (store.linking && store.linking.from === this)!;
    }

    public updateCenterCoords = action(() => {
        const { x, y, width, height } = this.portElement.getBoundingClientRect() as DOMRect;
        const [halfWidth, halfHeight] = [width / 2, height / 2];

        this.centerCoords = [x + halfWidth, y + halfHeight];
    })

    constructor(label: string, key: string) {
        this.label = label;
        this.key = key;

        this.uniqueId = shortId();
        this.portId = `port-${this.uniqueId}`;
    }

    public setNode = (node: Node) => {
        this.node = node;
        this.elementId = `${node.elementId}-port-${this.uniqueId}`;
    }

    public setPort = (port: AnyPort | undefined) => {
        this.port = port;
    }

    public onMount = () => {
        const portSelection = d3.select(`#${this.portId}`);
        this.portElement = portSelection.node() as Element;

        portSelection.on("mousedown", () => {
            d3.event.preventDefault();
            d3.event.stopPropagation();

            store.graph.startLink(this as AnyPort);
        })

        d3.selectAll(`.${this.elementId}`)
            .on("mouseup", () => {
                d3.event.preventDefault();
                d3.event.stopPropagation();

                store.graph.attachLink(this as AnyPort);
            });

        this.updateCenterCoords();
    }

}

export { Port };