import { observable } from "mobx";

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