import { Port } from "../Port";
import { PortIOType } from "../types";

abstract class ValuePort<IOType extends PortIOType> extends Port<IOType, "value"> {
    constructor(label: string) {
        super(label);
        this.type = "value";
    }
}
class InputValuePort extends ValuePort<"input"> {
    constructor(label: string) {
        super(label);
        this.ioType = "input";
    }
}
class OutputValuePort extends ValuePort<"output"> {
    constructor(label: string) {
        super(label);
        this.ioType = "output";
    }
}

export { InputValuePort, OutputValuePort };