import { Input } from './input';
import { Output } from './output';

export class Connection {

    public input: Input;
    public output: Output;
    public data: object;

    constructor(output, input) {
        this.output = output;
        this.input = input;
        this.data = {};

        this.input.addConnection(this);
    }

    remove() {
        this.input.removeConnection(this);
        this.output.removeConnection(this);
    }
}