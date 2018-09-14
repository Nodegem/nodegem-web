import { Port } from "../Port";
import { PortIOType } from "../types";
import { Node } from "../../Node";

import { InputValuePortView, OutputValuePortView } from './Views';
import { InputBox } from "./Input/InputBox";

abstract class ValuePort<IOType extends PortIOType> extends Port<IOType, "value"> {
    constructor(label: string, key: string) {
        super(label, key);
        this.type = "value";
    }
}
class InputValuePort extends ValuePort<"input"> {

    defaultValue: any;
    inputBox: InputBox;

    public get connected() { return true; }

    constructor(label: string, key: string, defaultValue: any) {
        super(label, key);
        this.ioType = "input";
        this.defaultValue = defaultValue;
        this.inputBox = new InputBox(this);
    }
}
class OutputValuePort extends ValuePort<"output"> {
    constructor(label: string, key: string) {
        super(label, key);
        this.ioType = "output";
    }
}

export { InputValuePort, OutputValuePort, InputValuePortView, OutputValuePortView };