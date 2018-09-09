import { observable } from "mobx";
import { PortIOType, PortType } from "./types";

abstract class Port<IOType extends PortIOType, PType extends PortType> {

    ioType: IOType;
    type: PType;
    label: string;
    key: string;
    @observable isConnected: boolean;

    constructor(label: string) {
        this.label = label;
        this.key = label.toLowerCase();
    }

}

export { Port };