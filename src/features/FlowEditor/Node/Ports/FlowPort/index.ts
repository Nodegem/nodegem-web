import { Port } from "../Port";
import { PortIOType } from "../types";

import { InputFlowPortView, OutputFlowPortView } from './Views';

abstract class FlowPort<IOType extends PortIOType> extends Port<IOType, "flow"> {
    constructor(label: string, key: string) {
        super(label, key);
        this.type = "flow";
    }
}
class InputFlowPort extends FlowPort<"input"> {
    constructor(label: string, key: string) {
        super(label, key);
        this.ioType = "input";
    }
}
class OutputFlowPort extends FlowPort<"output"> {
    constructor(label: string, key: string) {
        super(label, key);
        this.ioType = "output";
    }
}

export { InputFlowPort, OutputFlowPort, InputFlowPortView, OutputFlowPortView };