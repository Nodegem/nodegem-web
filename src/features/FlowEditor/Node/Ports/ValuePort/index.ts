import { Port } from "../Port";
import { PortIOType } from "../types";
import { Node } from "../../Node";

abstract class ValuePort<IOType extends PortIOType> extends Port<IOType, "value"> {
    constructor(node: Node, label: string) {
        super(node, label);
        this.type = "value";
    }
}
class InputValuePort extends ValuePort<"input"> {
    constructor(node: Node, label: string) {
        super(node, label);
        this.ioType = "input";
    }
}
class OutputValuePort extends ValuePort<"output"> {
    constructor(node: Node, label: string) {
        super(node, label);
        this.ioType = "output";
    }
}

export { InputValuePort, OutputValuePort };