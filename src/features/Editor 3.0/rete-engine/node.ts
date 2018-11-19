import { Control } from './control';
import { Input } from './input';
import { Output } from './output';
import { uuid } from 'lodash-uuid';

export type NodeKeyValueData = { key: string, value: any };
export type NodeImportExport = { id: string, namespace: string, position: [number, number], fieldData?: Array<NodeKeyValueData> }
export class Node {

    public data: Array<NodeKeyValueData>;
    public meta: any;
    public name: string;
    public id: string;
    public position: [number, number];

    public inputs: Map<string, Input>;
    public outputs: Map<string, Output>;
    public controls: Map<string, Control>;

    constructor(name: string) {
        this.name = name;
        this.id = uuid();
        this.position = [0.0, 0.0];

        this.inputs = new Map();
        this.outputs = new Map();
        this.controls = new Map();
        this.data = [];
        this.meta = {};
    }

    addControl(control: Control) {
        control.parent = this;

        this.controls.set(control.key, control);
        return this;
    }

    removeControl(control: Control) {
        control.parent = null;

        this.controls.delete(control.key);
    }

    addInput(input: Input) {
        if (input.node !== null)
            throw new Error('Input has already been added to the node');
 
        input.node = this;

        this.inputs.set(input.key, input);
        return this;
    }

    removeInput(input: Input) {
        input.removeLinks();
        input.node = null;

        this.inputs.delete(input.key);
    }

    addOutput(output: Output) {
        if (output.node !== null)
            throw new Error('Output has already been added to the node');
        
        output.node = this;

        this.outputs.set(output.key, output);
        return this;
    }

    removeOutput(output: Output) {
        output.removeLinks();
        output.node = null;

        this.outputs.delete(output.key);
    }

    getLinks() {
        const ios = [...Array.from(this.inputs.values()), ...Array.from(this.outputs.values())];
        const links = ios.reduce((arr, io) => {
            return [...arr, ...io.links];
        }, []);
    
        return links;
    }

    toJSON() : NodeImportExport {
        return {
            id: this.id,
            fieldData: Object.keys(this.data).map(x => ({
                key: x,
                value: this.data[x]
            })),
            position: this.position,
            namespace: this.name
        }
    }

    static fromJSON(json: NodeImportExport) {
        const node = new Node(json.namespace);

        node.id = json.id;
        node.data = json.fieldData || [];
        node.position = json.position;

        return node;
    }
}