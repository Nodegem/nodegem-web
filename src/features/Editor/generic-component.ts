import { GenericControl } from './generic-control';
import { Component } from './rete-engine/component';
import { Input } from './rete-engine/input';
import { Node } from './rete-engine/node';
import { Output } from './rete-engine/output';
import { Socket } from './rete-engine/socket';

const sockets = {
    flow: new Socket('Flow'),
    value: new Socket('Value'),
};

export class GenericComponent extends Component {
    public nodeDefinition: NodeDefinition;
    public props: object;

    constructor(nodeDefinition: NodeDefinition) {
        super(nodeDefinition.fullName);

        this.props = {
            fullName: nodeDefinition.fullName,
            title: nodeDefinition.title,
            component: this,
        };

        this.nodeDefinition = nodeDefinition;
    }

    public async builder(node: Node) {
        const {
            flowInputs,
            flowOutputs,
            valueInputs,
            valueOutputs,
        } = this.nodeDefinition;

        const editor = this.editor;
        const inputs: Input[] = [];
        const outputs: Output[] = [];

        (flowInputs || []).forEach(x =>
            inputs.push(new Input(x.key, x.label, sockets.flow, false))
        );
        (flowOutputs || []).forEach(x =>
            outputs.push(new Output(x.key, x.label, sockets.flow, false))
        );

        (valueInputs || []).forEach(x => {
            const input = new Input(x.key, x.label, sockets.value, false);
            input.addControl(
                new GenericControl(
                    editor,
                    x.key,
                    x.label,
                    x.defaultValue,
                    x.valueType
                )
            );
            inputs.push(input);
        });

        (valueOutputs || []).forEach(x =>
            outputs.push(new Output(x.key, x.label, sockets.value, true))
        );

        inputs.forEach(x => node.addInput(x));
        outputs.forEach(x => node.addOutput(x));

        return node;
    }
}
