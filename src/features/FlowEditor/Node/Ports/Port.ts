import { observable } from "mobx";
import { PortIOType, PortType } from "./types";

abstract class Port<IOType extends PortIOType, PType extends PortType> {

    ioType: IOType;
    type: PType;
    label: string;
    @observable isConnected: boolean;

    constructor(label: string) {
        this.label = label;
    }

}

export { Port };