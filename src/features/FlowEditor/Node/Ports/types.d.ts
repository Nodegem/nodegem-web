import { InputValuePort, OutputValuePort } from "./ValuePort";
import { InputFlowPort, OutputFlowPort } from "./FlowPort";

type PortIOType = "input" | "output";
type PortType = "flow" | "value";

type FlowPort = InputFlowPort | OutputFlowPort;
type ValuePort = InputValuePort | OutputValuePort;

type AnyPort = FlowPort | ValuePort;