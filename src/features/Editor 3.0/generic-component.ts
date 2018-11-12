import { Component } from "./rete-engine/component";
import { Socket } from "./rete-engine/socket";
import { Input } from "./rete-engine/input";
import { Node } from "./rete-engine/node";
import { ReactControl } from "./rete-plugins/react-render-plugin/src/react-control";
import { Output } from "./rete-engine/output";

const sockets = {
    flow: new Socket("Flow"),
    value: new Socket("Value")
};

export class GenericComponent extends Component {

    private nodeDefinition: NodeDefinition;

    constructor(nodeDefinition: NodeDefinition) {
        super(nodeDefinition.namespace);

        this.data = {
            namespace: nodeDefinition.namespace,
            title: nodeDefinition.namespace.split('.').lastOrDefault(),
            component: this
        }

        this.nodeDefinition = nodeDefinition;
    }

    async builder(node: Node) {

        const { flowInputs, flowOutputs, valueInputs, valueOutputs } = this.nodeDefinition;

        let inputs: Input[] = [];
        let outputs: Output[] = [];
        
        flowInputs.forEach(x => inputs.push(new Input(x.key, x.label, sockets.flow, false)));
        flowOutputs.forEach(x => outputs.push(new Output(x.key, x.label, sockets.flow, false)));
        valueInputs.forEach(x => inputs.push(new Input(x.key, x.label, sockets.value, false)));
        valueOutputs.forEach(x => outputs.push(new Output(x.key, x.label, sockets.value, true)));

        inputs.forEach(x => node.addInput(x));
        outputs.forEach(x => node.addOutput(x));

        return node;
    }

}