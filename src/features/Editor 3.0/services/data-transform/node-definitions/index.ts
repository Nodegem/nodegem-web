// export const createNodeFromDefinition = (definition: NodeDefinition, position: [number, number]) : Node => {
//     var newNode = new Node(definition.title, definition.namespace, position);
//     definition.flowInputs.forEach(x => newNode.addPort(new InputFlowPort(x.label, x.key)));
//     definition.flowOutputs.forEach(x => newNode.addPort(new OutputFlowPort(x.label, x.key)));
//     definition.valueInputs.forEach(x => newNode.addPort(new InputValuePort(x.label, x.key, x.defaultValue)));
//     definition.valueOutputs.forEach(x => newNode.addPort(new OutputValuePort(x.label, x.key)));
//     return newNode;
// }