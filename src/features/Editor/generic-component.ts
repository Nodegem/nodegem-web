import { Component } from "./rete-engine/component";
import { Socket } from "./rete-engine/socket";
import { Input } from "./rete-engine/input";
import { Node } from "./rete-engine/node";
import { Output } from "./rete-engine/output";
import { GenericControl } from "./generic-control";
import { NodeDefinition } from "src/services/graph/node-definitions/types";

const sockets = {
    flow: new Socket("Flow"),
    value: new Socket("Value")
};

export class GenericComponent extends Component {

    private nodeDefinition: NodeDefinition;
    public props: object;

    constructor(nodeDefinition: NodeDefinition) {
        super(nodeDefinition.namespace);

        this.props = {
            namespace: nodeDefinition.namespace,
            title: nodeDefinition.title,
            component: this
        }

        this.nodeDefinition = nodeDefinition;
    }

    async builder(node: Node) {

        const { flowInputs, flowOutputs, valueInputs, valueOutputs } = this.nodeDefinition;

        const editor = this.editor;
        let inputs: Input[] = [];
        let outputs: Output[] = [];
        
        flowInputs.forEach(x => inputs.push(new Input(x.key, x.label, sockets.flow, false)));
        flowOutputs.forEach(x => outputs.push(new Output(x.key, x.label, sockets.flow, false)));

        valueInputs.forEach(x => {
            const input = new Input(x.key, x.label, sockets.value, false);
            input.addControl(new GenericControl(editor, x.key, x.label, x.defaultValue, x.valueType))
            inputs.push(input);
        });
        valueOutputs.forEach(x => outputs.push(new Output(x.key, x.label, sockets.value, true)));

        inputs.forEach(x => node.addInput(x));
        outputs.forEach(x => node.addOutput(x));

        return node;
    }

}