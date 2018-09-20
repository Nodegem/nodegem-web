import { flowContextStore } from './../store/flow-context-store';
import { uuid } from "lodash-uuid";
import { InputValuePort, OutputValuePort, OutputFlowPort, InputFlowPort } from "./Ports";
import { observable, action } from "mobx";
import { LinkOptions } from '../Link';
import { ValuePort, FlowPort, AnyPort } from './Ports/types';
import _ from 'lodash';
import { flowEditorStore } from '..';
import shortId from 'shortid';
import * as d3 from "d3";
import { hasChildWithClass } from "../utils";
import { Menu } from "../FlowContextMenu/FlowContextMenuView";

class Node
{
    id = uuid();
    
    elementId: string = `node-${shortId()}`;

    type: string;
    title: string;
    links: Array<LinkOptions> = [];
    @observable position: XYCoords;
    @observable allPorts: Array<AnyPort> = [];

    public get valuePorts() : Array<ValuePort> {
        return this.allPorts.filter(x => x instanceof InputValuePort || x instanceof OutputValuePort) as Array<ValuePort>;
    }

    public get flowPorts() : Array<FlowPort> {
        return this.allPorts.filter(x => x instanceof InputFlowPort || x instanceof OutputFlowPort) as Array<FlowPort>;
    }

    public get numInputs() : number {
        return this.inputFlowPorts.length + this.inputValuePorts.length;
    }

    public get numOutputs() : number {
        return this.outputFlowPorts.length + this.outputValuePorts.length;
    }

    public get inputValuePorts() : Array<InputValuePort> {
        return this.valuePorts.filter(x => x instanceof InputValuePort) as Array<InputValuePort>;
    }

    public get inputFlowPorts() : Array<InputFlowPort> {
        return this.flowPorts.filter(x => x instanceof InputFlowPort) as Array<InputFlowPort>;
    }

    public get outputValuePorts() : Array<OutputValuePort> {
        return this.valuePorts.filter(x => x instanceof OutputValuePort) as Array<OutputValuePort>;
    }

    public get outputFlowPorts() : Array<OutputFlowPort> {
        return this.flowPorts.filter(x => x instanceof OutputFlowPort) as Array<OutputFlowPort>;
    }

    constructor(title: string, type: string, position: XYCoords | undefined = undefined) {
        this.title = title;
        this.type = type;
        this.position = position || [0, 0];
    }

    public handleDragStart = (e: React.MouseEvent) => {

        const clientOffset = this.convert([e.clientX, e.clientY]);
        const offset = [clientOffset[0] - this.position[0], clientOffset[1] - this.position[1]];

        const handleMove = action((e: MouseEvent) => {
            const newPos = this.convert([e.clientX, e.clientY]);
            this.position = [newPos[0] - offset[0], newPos[1] - offset[1]];
        });

        const handleUp = () => {
            this.updatePortsPositions();

            document.removeEventListener("mousemove", handleMove);
            document.removeEventListener("mouseup", handleUp);
        }

        document.addEventListener("mouseup", handleUp);
        document.addEventListener("mousemove", handleMove);
    }

    public onMount = () => {
        d3.select(`#${this.elementId}`)
            .on("contextmenu", this.handleContextMenu)
            .on("mousedown", this.handleMouseDown);
    }

    private handleContextMenu = () => {
        const e = d3.event;
        e.preventDefault();
        e.stopPropagation();

        const menu : Menu = {
            items: [
                { label: "Delete", action: () => this.remove() }
            ]
        };

        flowContextStore.show(menu, [e.pageX, e.pageY]);
    }

    private handleMouseDown = () => {
        const e = d3.event;

        if(e.target instanceof Element
            && e.target.tagName.toLowerCase() !== "input")
        {
            e.stopPropagation();
            e.preventDefault();
        }

        if(e.button !== 0) return;

        if(hasChildWithClass(e.target as Element, "header")) {
            this.handleDragStart(e);
        }
    }

    public addPort = action((port: AnyPort) => {
        port.setNode(this);
        this.allPorts.push(port);
    })

    public addLink = (link: LinkOptions) => {
        this.links.push(link);
    }

    public removeLink = (link: LinkOptions) => {
        _.remove(this.links, link);
    }

    private updatePortsPositions = () => {
        this.allPorts.forEach(x => x.updateCenterCoords());
    }

    public updateLinks = () => {
        this.links.forEach(x => {
            x.source.port.updateCenterCoords();
            x.destination.port.updateCenterCoords();
        })
    }

    private convert = (coords: XYCoords) : XYCoords => {
        return flowEditorStore.graph.convertCoords(coords);
    }

    public remove = action(() => {
        this.links.forEach(x => x.remove());
        _.remove(flowEditorStore.nodes, this);
    })

}

export { Node };