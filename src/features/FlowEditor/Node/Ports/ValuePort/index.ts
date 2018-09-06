import { Port } from "../Port";


class ValuePort<IOType extends PortIOType> extends Port<IOType, "value"> {}
class InputValuePort extends ValuePort<"input"> {}
class OutputValuePort extends ValuePort<"output"> {}

export { InputValuePort, OutputValuePort };