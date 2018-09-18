import { computed, observable, action } from "mobx";
import { PortIOType, PortType, AnyPort } from "./types";
import { store } from "../..";
import { Node } from "../Node";
import shortId from 'shortid';
import * as d3 from 'd3';
import { LinkOptions } from "../../Link";
import _ from "lodash";

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
    protected links : Array<LinkOptions> = [];

    @observable
    centerCoords : XYCoords = [NaN, NaN];

    portElement: Element;

    @computed
    public get hasALink() : boolean {
        return this.links.length > 0;
    }

    @computed
    public get connected(): boolean {
        return this.hasALink || (store.linking && store.linking.from === this)!;
    }

    public updateCenterCoords = action(() => {

        if(!this.portElement) return;

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

    public addLink = action((link: LinkOptions) => {
        this.links.push(link);
    })

    public detachLink = action((link: LinkOptions) => {
        link.remove();
        _.remove(this.links, link);
    })

    public onMount = () => {
        const portSelection = d3.select(`#${this.portId}`);
        this.portElement = portSelection.node() as Element;

        portSelection.on("mousedown", () => {
            d3.event.preventDefault();
            d3.event.stopPropagation();

            if(!this.shouldDetachLink(d3.event)) {
                store.graph.startLink(this as AnyPort);
            } else {
                store.graph.detachLink(this as AnyPort);
            }
        })

        d3.selectAll(`.${this.elementId}`)
            .on("mouseup", () => {
                d3.event.preventDefault();
                d3.event.stopPropagation();

                store.graph.attachLink(this as AnyPort);
            });

        this.updateCenterCoords();
    }

    public getTopMostLink = () : LinkOptions | undefined => {
        return this.links.length > 0 ? this.links[0] : undefined;
    }

    protected shouldDetachLink = (event) : boolean => {
        return this.connected && this.ioType === "input";
    }
}

export { Port };