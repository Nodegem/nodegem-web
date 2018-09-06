import { Port } from "../Port";

class FlowPort<IOType extends PortIOType> extends Port<IOType, "flow"> {}
class InputFlowPort extends FlowPort<"input"> {}
class OutputFlowPort extends FlowPort<"output"> {}

export { InputFlowPort, OutputFlowPort };