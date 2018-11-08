import { Component } from "./rete-engine/component";
import { Socket } from "./rete-engine/socket";

const sockets = {
    flow: new Socket("Flow"),
    value: new Socket("Value")
};

export class GenericComponent extends Component {

    public flowInputs: any;
    public flowOutputs: any;
    public valueInputs: any;
    public valueOutputs: any;

    constructor(namespace: string, flowInputs: any, flowOutputs: any, valueInputs: any, valueOutputs: any) {
        super(namespace);

        this.data = {
            namespace: namespace,
            title: namespace.split('.').lastOrDefault(),
            component: this
        }

        this.flowInputs = flowInputs;
        this.flowOutputs = flowOutputs;
        this.valueInputs = valueInputs;
        this.valueOutputs = valueOutputs;
    }

    async builder() {
    }

}