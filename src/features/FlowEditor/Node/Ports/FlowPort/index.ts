import { Port } from "../Port";
import { PortIOType } from "../types";

abstract class FlowPort<IOType extends PortIOType> extends Port<IOType, "flow"> {
    constructor(label: string) {
        super(label);
        this.type = "flow";
    }
}
class InputFlowPort extends FlowPort<"input"> {
    constructor(label: string) {
        super(label);
        this.ioType = "input";
    }
}
class OutputFlowPort extends FlowPort<"output"> {
    constructor(label: string) {
        super(label);
        this.ioType = "output";
    }
}

export { InputFlowPort, OutputFlowPort };