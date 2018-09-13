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
    definition.flowInputs.forEach(x => newNode.allPorts.push(new InputFlowPort(newNode, x.label, x.key)));
    definition.flowOutputs.forEach(x => newNode.allPorts.push(new OutputFlowPort(newNode, x.label, x.key)));
    definition.valueInputs.forEach(x => newNode.allPorts.push(new InputValuePort(newNode, x.label, x.key, x.defaultValue)));
    definition.valueOutputs.forEach(x => newNode.allPorts.push(new OutputValuePort(newNode, x.label, x.key)));
    return newNode;
}