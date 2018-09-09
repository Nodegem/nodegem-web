import { observable, computed } from "mobx";
import { PortIOType, PortType } from "./types";
import { store } from "../..";
import { Node } from '../Node';

abstract class Port<IOType extends PortIOType, PType extends PortType> {

    ioType: IOType;
    type: PType;
    label: string;
    key: string;
    
    @computed 
    public get connected(): boolean {
        return store.links.some(x => x.source.port === this || x.destination.port === this);
    }

    constructor(label: string) {
        this.label = label;
        this.key = label.toLowerCase();
    }

}

export { Port };