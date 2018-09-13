import { Port } from "../Port";
import { PortIOType } from "../types";
import { Node } from "../../Node";

import { InputValuePortView, OutputValuePortView } from './Views';

abstract class ValuePort<IOType extends PortIOType> extends Port<IOType, "value"> {
    constructor(node: Node, label: string, key: string) {
        super(node, label, key);
        this.type = "value";
    }
}
class InputValuePort extends ValuePort<"input"> {

    defaultValue: any;

    constructor(node: Node, label: string, key: string, defaultValue: any) {
        super(node, label, key);
        this.ioType = "input";
        this.defaultValue = defaultValue;
    }
}
class OutputValuePort extends ValuePort<"output"> {
    constructor(node: Node, label: string, key: string) {
        super(node, label, key);
        this.ioType = "output";
    }
}

export { InputValuePort, OutputValuePort, InputValuePortView, OutputValuePortView };