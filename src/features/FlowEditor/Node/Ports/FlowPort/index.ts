import { Port } from "../Port";
import { PortIOType } from "../types";
import { Node } from "../../Node";

import { InputFlowPortView, OutputFlowPortView } from './Views';

abstract class FlowPort<IOType extends PortIOType> extends Port<IOType, "flow"> {
    constructor(node: Node, label: string, key: string) {
        super(node, label, key);
        this.type = "flow";
    }
}
class InputFlowPort extends FlowPort<"input"> {
    constructor(node: Node, label: string, key: string) {
        super(node, label, key);
        this.ioType = "input";
    }
}
class OutputFlowPort extends FlowPort<"output"> {
    constructor(node: Node, label: string, key: string) {
        super(node, label, key);
        this.ioType = "output";
    }
}

export { InputFlowPort, OutputFlowPort, InputFlowPortView, OutputFlowPortView };