import { flowContextStore } from './../store/flow-context-store';
import { OutputFlowPort, InputFlowPort } from "../Node/Ports/FlowPort";
import { Node } from '../Node';
import { FlowPort, AnyPort, ValuePort } from "../Node/Ports/types";
import { OutputValuePort, InputValuePort } from '../Node/Ports/ValuePort';
import { flowEditorStore } from '..';
import _ from 'lodash';
import shortId from 'shortid';
import * as d3 from "d3";
import { Menu } from "../FlowContextMenu/FlowContextMenuView";

interface Connection<T extends AnyPort> {
    node: Node;
    port: T;
}

class Link<T extends AnyPort> {

    id = shortId();

    source: Connection<T>;
    destination: Connection<T>;

    constructor(source: Connection<T>, destination: Connection<T>) {
        this.source = source;
        this.destination = destination;
    }

    public onMount = () => {
        d3.select(`#_${this.id}-handle`)
            .on("contextmenu", this.onRightClick)
    }

    private onRightClick = () => {
        const e = d3.event;

        e.preventDefault();
        e.stopPropagation();

        const menu : Menu = {
            items: [
                { label: "Delete Link", action: () => flowEditorStore.removeLink(this as LinkOptions) }
            ]  
        };

        flowContextStore.show(menu, [e.pageX, e.pageY]);
    }

}

class FlowLink extends Link<FlowPort> {

    constructor(source: Connection<OutputFlowPort>, destination: Connection<InputFlowPort>) {
        super(source, destination);
    }

}

class ValueLink extends Link<ValuePort> {
    
    constructor(source: Connection<OutputValuePort>, destination: Connection<InputValuePort>) {
        super(source, destination);
    }

}

type LinkOptions = ValueLink | FlowLink;

export { FlowLink, ValueLink, LinkOptions, Connection };