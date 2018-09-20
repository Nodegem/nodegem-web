import { Node } from "../../Node";
import { InputFlowPort, OutputFlowPort, InputValuePort, OutputValuePort } from "../../Node/Ports";

interface NodeDefinition {
    type: string;
    title: string;
    description: string;
    flowInputs: Array<FlowInputDefinition>;
    flowOutputs: Array<FlowOutputDefinition>;
    valueInputs: Array<ValueInputDefinition>;
    valueOutputs: Array<ValueOutputDefinition>;
}

interface FieldDefinition {
    key: string;
    label: string;
}

interface FlowInputDefinition extends FieldDefinition {

}

interface FlowOutputDefinition extends FieldDefinition {

}

interface ValueInputDefinition extends FieldDefinition {
    defaultValue: any;
}

interface ValueOutputDefinition extends FieldDefinition {

}

export { NodeDefinition };

export const createNodeFromDefinition = (definition: NodeDefinition, position: XYCoords) : Node => {
    var newNode = new Node(definition.title, definition.type, position);
    definition.flowInputs.forEach(x => newNode.addPort(new InputFlowPort(x.label, x.key)));
    definition.flowOutputs.forEach(x => newNode.addPort(new OutputFlowPort(x.label, x.key)));
    definition.valueInputs.forEach(x => newNode.addPort(new InputValuePort(x.label, x.key, x.defaultValue)));
    definition.valueOutputs.forEach(x => newNode.addPort(new OutputValuePort(x.label, x.key)));
    return newNode;
}