import { computed } from "mobx";
import { PortIOType, PortType } from "./types";
import { store } from "../..";
import { Node } from "../Node";

abstract class Port<IOType extends PortIOType, PType extends PortType> {

    ioType: IOType;
    type: PType;
    label: string;
    key: string;
    node: Node;
    
    @computed 
    public get connected(): boolean {
        return (store.linking && store.linking.from === this) 
            || store.links.some(x => x.source.port === this || x.destination.port === this);
    }

    constructor(node: Node, label: string) {
        this.node = node;
        this.label = label;
        this.key = label.toLowerCase();
    }

}

export { Port };