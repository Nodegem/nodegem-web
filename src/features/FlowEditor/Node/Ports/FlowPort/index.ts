import { Port } from "../Port";
import { PortIOType } from "../types";
import { Node } from "../../Node";

import { InputFlowPortView, OutputFlowPortView } from './Views';

abstract class FlowPort<IOType extends PortIOType> extends Port<IOType, "flow"> {
    constructor(node: Node, label: string) {
        super(node, label);
        this.type = "flow";
    }
}
class InputFlowPort extends FlowPort<"input"> {
    constructor(node: Node, label: string) {
        super(node, label);
        this.ioType = "input";
    }
}
class OutputFlowPort extends FlowPort<"output"> {
    constructor(node: Node, label: string) {
        super(node, label);
        this.ioType = "output";
    }
}

export { InputFlowPort, OutputFlowPort, InputFlowPortView, OutputFlowPortView };