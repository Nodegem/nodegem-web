import { computed, observable, action } from "mobx";
import { PortIOType, PortType, AnyPort } from "./types";
import { flowEditorStore } from "../..";
import { Node } from "../Node";
import shortId from 'shortid';
import * as d3 from 'd3';
import { LinkOptions } from "../../Link";
import _ from "lodash";

abstract class Port<IOType extends PortIOType, PType extends PortType> {

    label: string;
    key: string;
    
    node: Node;
    ioType: IOType;
    type: PType;
    
    @observable
    protected links : Array<LinkOptions> = [];
    
    @observable
    centerCoords : XYCoords = [NaN, NaN];
    
    uniqueId: string;
    portId: string;
    elementId: string;
    portElement: Element;

    @computed
    public get connected(): boolean {
        return flowEditorStore.isCurrentlyBeingLinked(this as AnyPort) || this.portHasLink();
    }

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

    public updateCenterCoords = action(() => {

        if(!this.portElement) return;

        const { x, y, width, height } = this.portElement.getBoundingClientRect() as DOMRect;
        const [halfWidth, halfHeight] = [width / 2, height / 2];

        this.centerCoords = [x + halfWidth, y + halfHeight];
    })

    public onMount = () => {
        const portSelection = d3.select(`#${this.portId}`);
        this.portElement = portSelection.node() as Element;

        portSelection.on("mousedown", () => {
            d3.event.preventDefault();
            d3.event.stopPropagation();

            if(!this.shouldDetachLink()) {
                flowEditorStore.graph.startLink(this as AnyPort);
            } else {
                flowEditorStore.graph.detachLink(this as AnyPort);
            }
        })

        d3.selectAll(`.${this.elementId}`)
            .on("mouseup", () => {
                d3.event.preventDefault();
                d3.event.stopPropagation();

                flowEditorStore.graph.attachLink(this as AnyPort);
            });

        this.updateCenterCoords();
    }

    private portHasLink = () : boolean => {
        return this.node.links.some(x => x.source.port === this || x.destination.port === this);
    }

    protected shouldDetachLink = () : boolean => {
        return this.connected && (this.ioType === "input" || (this.ioType === "output" && this.type === "flow"));
    }
}

export { Port };